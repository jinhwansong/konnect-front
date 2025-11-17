import React from 'react';

import MentorDetail from '@/components/mentors/MentorDetail';
import ReserveModal from '@/components/mentors/ReserveModal';

export const dynamic = 'force-dynamic';

interface ReservePageProps {
  params: Promise<{ id: string }>;
}

export default async function ReservePage({ params }: ReservePageProps) {
  const { id } = await params;

  return (
    <>
      <ReserveModal sessionId={id} />
      <MentorDetail sessionId={id} />
    </>
  );
}
