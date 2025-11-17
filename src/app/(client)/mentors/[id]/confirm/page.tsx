import React from 'react';

import ConfirmModal from '@/components/mentors/ConfirmModal';
import MentorDetail from '@/components/mentors/MentorDetail';

interface ConfirmPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConfirmPage({ params }: ConfirmPageProps) {
  const { id } = await params;
  return (
    <>
      <ConfirmModal sessionId={id} />
      <MentorDetail sessionId={id} />
    </>
  );
}
