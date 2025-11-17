'use client';

import { useEffect, useRef, useState } from 'react';

import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

interface User {
  id: string;
  name: string;
  image?: string;
  isMentor?: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  isMentor: boolean;
  message: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface ChatWindowProps {
  roomId: string;
  currentUser: User;
}

export default function ChatWindow({ roomId, currentUser }: ChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 스크롤을 맨 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // TODO: Socket.IO 연결 및 채팅 이벤트 리스너
    // TODO: 기존 메시지 로드
    setIsConnected(true);

    // 임시 메시지 데이터
    setMessages([
      {
        id: '1',
        userId: 'mentor-1',
        userName: '김멘토',
        isMentor: true,
        message: '안녕하세요! 멘토링을 시작하겠습니다.',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        type: 'text',
      },
      {
        id: '2',
        userId: 'system',
        userName: '시스템',
        isMentor: false,
        message: `${currentUser.name}님이 참여했습니다.`,
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        type: 'system',
      },
    ]);
  }, [roomId, currentUser.name]);

  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userImage: currentUser.image,
      isMentor: currentUser.isMentor || false,
      message: message.trim(),
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, newMessage]);

    // TODO: Socket.IO로 메시지 전송
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* 채팅 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
            <svg
              className="h-4 w-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">채팅</h3>
            <p className="text-xs text-gray-500">
              {isConnected ? '연결됨' : '연결 중...'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 참여자 수 */}
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <svg
              className="h-3 w-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>2명</span>
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <svg
                className="mx-auto mb-3 h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-sm text-gray-500">아직 메시지가 없습니다</p>
              <p className="text-xs text-gray-400">첫 메시지를 보내보세요!</p>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <ChatMessage
              key={message.id}
              message={message}
              isCurrentUser={message.userId === currentUser.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 메시지 입력 */}
      <div className="border-t border-gray-200 bg-white">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}
