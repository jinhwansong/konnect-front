import Footer from '@/components/common/Footer';
import Toast from '@/components/common/Toast';
import Header from '@/components/main/Header';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--background)]">
      <Header />
      {children}
      <Footer />
      <Toast />
    </div>
  );
}
