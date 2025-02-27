import { IMentorApprovalParams } from "@/type";
import { useMutation } from "@tanstack/react-query";

export const findMentorAll = async (page: number) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/applications?page=${page}&limit=10`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw data;
  }
  return data;
};

export const findMentorApproval = async (id:number) => {
const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/applications/${id}`,
  {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  }
);
const data = await res.json();
if (!res.ok) {
  throw data;
}
return data;
}

export const useMentor = () => {
  return useMutation({
    mutationFn: async ({ approved, reason, id }: IMentorApprovalParams) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/approve/${id}`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            approved,
            reason,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        throw data;
      }
      return data;
    },
  });
};