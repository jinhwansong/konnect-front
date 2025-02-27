'use server'
import { redirect } from 'next/navigation';

export const onSubmit = async (prevState:any, formData: FormData) => {
    if (!formData.get('email') || !(formData.get('email') as string)?.trim()) {
      return { message: 'no_email' };
    }
    if (
      !formData.get('password') ||
      !(formData.get('password') as string)?.trim()
    ) {
      return { message: 'no_password' };
    }
    if (
      !formData.get('password') ||
      !(formData.get('password') as string)?.trim()
    ) {
      return { message: 'no_password' };
    }
    if (!formData.get('name') || !(formData.get('name') as string)?.trim()) {
      return { message: 'no_name' };
    }
    if (
      !formData.get('nickname') ||
      !(formData.get('nickname') as string)?.trim()
    ) {
      return { message: 'no_nickname' };
    }
    if (!formData.get('phone') || !(formData.get('phone') as string)?.trim()) {
      return { message: 'no_phone' };
    }
    
    let shouldRedirect = false;
    const formDataObject = Object.fromEntries(formData);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 쿠키전달
        credentials: 'include',
        body: JSON.stringify(formDataObject),
      });
      const data = await res.json();
      shouldRedirect = true;

    } catch (error) {
      return { message: error };
    }
    if (shouldRedirect) {
      // redirect는 try catch에는 없어야된다.
      redirect('/login');
    }
};



