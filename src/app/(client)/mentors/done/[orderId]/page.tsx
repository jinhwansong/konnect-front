import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import React from 'react';

import ReservationDoneDetail from '@/components/mentors/ReservationDoneDetail';
import { getReservationComplete } from '@/libs/reservation';

interface DonePageProps {
  params: Promise<{ orderId: string }>;
}

export default async function DonePage({ params }: DonePageProps) {
  const { orderId } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['reservationDone', orderId],
    queryFn: () => getReservationComplete(orderId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReservationDoneDetail orderId={orderId} />
    </HydrationBoundary>
  );
}
