import { cookies } from 'next/headers';
// 초기 채팅방정보
export async function getChatRoomData({ chatRoomId }: { chatRoomId: number }) {
  const cookieStore = cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join('; ');
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/chat/${chatRoomId}`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Cookie: cookieHeader,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
