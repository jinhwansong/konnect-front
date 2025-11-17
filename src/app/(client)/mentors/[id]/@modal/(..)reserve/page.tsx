import ReserveModal from '@/components/mentors/ReserveModal';
export const dynamic = 'force-dynamic';

interface ReservePageProps {
  params: Promise<{ id: string }>;
}

export default async function ReservePage({ params }: ReservePageProps) {
  const { id } = await params;
  return <ReserveModal sessionId={id} />;
}
