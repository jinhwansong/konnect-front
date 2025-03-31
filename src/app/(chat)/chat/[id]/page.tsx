import React from 'react'
import { getChatRoomData } from '@/app/_lib/useActions';

import ChatRoom from '../../_component/ChatRoom';

export default async function page({ params }: { params: { id: string } }) {
  const data = await getChatRoomData({ chatRoomId: Number(params.id) });
  return <ChatRoom data={data} />
}
