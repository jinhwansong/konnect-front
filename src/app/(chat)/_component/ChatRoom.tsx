'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import style from './chat.module.scss'
import { formatDateTime } from '@/util/formatDateTime';
import {
  PiWechatLogo,
  PiMicrophone,
  PiMicrophoneSlash,
  PiCamera,
  PiCameraSlash,
  PiPhoneSlash,
  PiUserList,
  PiUserListFill,
  PiWechatLogoFill,
} from 'react-icons/pi';
import { BsSendFill } from 'react-icons/bs';
import { BiX } from 'react-icons/bi';
import useInput from '@/hooks/useInput';
import Image from 'next/image';
import { getImageUrl } from '@/util/getImageUrl';
import { io, Socket } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMessage } from '@/app/_lib/useEtc';
import { useUserData } from '@/app/_lib/useUser';
import getTime from '@/util/getTime';
import { useRouter } from 'next/navigation';


interface IUser{
  id: number
  name: string;
  role: string;
  isActive: boolean
  image: string;
}

interface IData {
  message:string;
  mentors: IUser;
  roomInfo: {
    id: number;
    roomTitle: string;
    createRoom: string;
  }
  mentees:IUser[];
}
interface IMessage {
  _id?: string;
  senderId: number;
  senderName: string;
  content: string;
  type?: string;
  fileUrl?: string;
  fileName?: string;
  createdAt: string;
}
export default function ChatRoom({ data }: { data: IData }) {
  const router = useRouter()
  console.log(data)
  // 내정보
    const { data:mydata } = useUserData();
  const [roomButton, setRoomButton] = useState({
    chat: false,
    list: false,
  });
  const queryClient = useQueryClient();
  const [message, onMessage, setMessage] = useInput('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<number[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // 유저리스트 토글
  const onRoomList = () => {
    setRoomButton((prev) => ({
      ...prev,
      chat: false,
      list: !prev.list,
    }));
  };
  // 채팅 토글
  const onRoomChat = () => {
    setRoomButton((prev) => ({
      ...prev,
      chat: !prev.chat,
      list: false,
    }));
  };
  // 타이핑 중지 함수
  const stopTyping = useCallback(() => {
    if (!socket || !isConnected) return;
    socket.emit('stopTyping', { roomId: data.roomInfo.id.toString() });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [socket, isConnected, data.roomInfo.id]);

  // 타이핑 시작 함수
  const startTyping = useCallback(() => {
    if (!socket || !isConnected) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit('startTyping', { roomId: data.roomInfo.id.toString() });
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 8000);
  }, [socket, isConnected, data.roomInfo.id, stopTyping]);
  // 소캣연결
  useEffect(() => {
    // 소캣연결
    const newSocket = io(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chat`, {
      withCredentials: true,
    });
    // 연결이벤트
    newSocket.on('connect', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('알림 소켓 연결 성공');
      }
      setIsConnected(true);
      // 채팅방 입장
      newSocket.emit('joinRoom', { roomId: data.roomInfo.id.toString() });
    });
    // 새 메시지 수신
    newSocket.on('newMessage', (message: IMessage) => {
      queryClient.setQueryData(
        ['getMessage', data.roomInfo.id],
        (oldData: IMessage[] = []) => {
          return [...oldData, message];
        }
      );
    });
    // 타이핑 할때
    newSocket.on('userTyping', ({ userId }: { userId: number }) => {
      setTypingUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    });
    // 타이핑 중지
    newSocket.on('userStoppedTyping', ({ userId }: { userId: number }) => {
      setTypingUsers((prev) => prev.filter((id) => id !== userId));
    });
    // 연결 해제
    newSocket.on('disconnect', () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('소켓 연결 끊김');
      }
      setIsConnected(false);
    });
    setSocket(newSocket);
    // 컴포넌트 언마운트 시 정리
    return () => {
      if (newSocket) {
        newSocket.emit('leaveRoom');
        newSocket.disconnect();
      }
    };
  }, [data.roomInfo.id, queryClient]);
  // 메시지 조회
  const { data: getMessages } = useQuery({
    queryKey: ['getMessage', data.roomInfo.id],
    queryFn: () =>
      getMessage({
        chatRoomId: data.roomInfo.id.toString(),
      }),
  });
  // 메시지 전송
  const sendMessage = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !socket || !isConnected) return;
    socket.emit('sendMessage', {
      roomId: data.roomInfo.id.toString(),
      content: message,
      type: 'TEXT',
    });
    setMessage('');
    stopTyping();
  }, [isConnected, socket, message, setMessage, data.roomInfo.id, stopTyping]);
  // 새 메시지가 추가되면 스크롤 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);
  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    onMessage(e); // 기존 입력 처리
    startTyping(); // 타이핑 시작 이벤트 발생
  };
  // 나가기
  const leaveRoom = () => {
     if (socket && isConnected) {
    // 소켓으로 채팅방 나가기 이벤트 발생
    socket.emit('leaveRoom');
    router.back();
  }

  }
  return (
    <section className={style.section}>
      <div className={style.roomInfo}>
        <p>시작시간 : {formatDateTime(data?.roomInfo?.createRoom)}</p>
        <h4>{data?.roomInfo?.roomTitle}</h4>
      </div>
      <div className={style.video}>
        {/* 채팅리스트 */}
        {roomButton.chat && (
          <div className={style.chatContainer}>
            <h3>
              채팅창{' '}
              <button onClick={onRoomChat}>
                <BiX />
              </button>
            </h3>
            <div className={style.messages}>
              {getMessages?.map((message: IMessage) => {
                const isCurrentUser = message.senderName === mydata.name;
                return (
                  <div key={message._id}>
                    <p
                      className={`${style.message} ${
                        isCurrentUser ? style.self : style.other
                      }`}
                    >
                      {message.content}
                    </p>
                    <span className={style.createdAt}>
                      {getTime(message.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>

            <form className={style.chatInput} onSubmit={sendMessage}>
              {typingUsers.length > 0 && (
                <div className={style.typingIndicator}>
                  {typingUsers
                    .map((userId) => {
                      // 사용자 이름 찾기
                      let typingUserName = '';
                      if (userId === data.mentors.id) {
                        typingUserName = data.mentors.name;
                      } else {
                        const mentee = data.mentees.find(
                          (m) => m.id === userId
                        );
                        if (mentee) {
                          typingUserName = mentee.name;
                        }
                      }
                      return typingUserName;
                    })
                    .filter(Boolean)
                    .join(', ')}{' '}
                  입력 중...
                </div>
              )}
              <input
                type="text"
                id="send"
                value={message}
                placeholder="모든 사용자에게 메시지 보내기"
                onChange={handleInputChange}
              />
              <label htmlFor="send">
                <BsSendFill />
              </label>
            </form>
          </div>
        )}

        {/* 유저 리스트 */}
        {roomButton.list && (
          <div className={style.userListContainer}>
            <h3>
              현재 참여자{' '}
              <button onClick={onRoomList}>
                <BiX />
              </button>
            </h3>
            <ul>
              <li>
                <Image
                  className={style.avatar}
                  src={getImageUrl(data?.mentors.image)}
                  alt="멘토 이미지"
                  width={30}
                  height={30}
                />
                <p>{data?.mentors.name} (멘토)</p>
              </li>
              {data?.mentees &&
                data?.mentees.map((mentees) => (
                  <li key={mentees.id}>
                    <Image
                      className={style.avatar}
                      src={getImageUrl(mentees.image)}
                      alt="멘티 이미지"
                      width={30}
                      height={30}
                    />
                    <p>{mentees.name} (멘티)</p>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
      <div className={style.otherButton}>
        <button>
          <PiMicrophone />
        </button>
        <button>
          <PiCamera />
        </button>
        <button onClick={onRoomChat}>
          {roomButton.chat ? <PiWechatLogoFill /> : <PiWechatLogo />}
        </button>
        <button onClick={onRoomList}>
          {roomButton.list ? <PiUserListFill /> : <PiUserList />}
        </button>
        <button onClick={leaveRoom}>
          <PiPhoneSlash />
        </button>
      </div>
    </section>
  );
}
