import MyPageSidebar from '@/components/my/MyPageSidebar';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto mt-10 mb-16 flex items-start gap-10 md:w-[768px] lg:w-[1200px]">
      <MyPageSidebar />
      {children}
    </main>
  );
}
