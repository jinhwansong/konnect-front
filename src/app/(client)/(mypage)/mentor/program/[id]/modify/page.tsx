'use client'
import React from 'react';
import ProgramForm from '../../../_component/ProgramForm';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getDetailProgram } from '@/app/_lib/useMentor';


export default function Modigy() {
  const params =useParams()
  const { data } = useQuery({
    queryKey: ['mentorDetail', params.id],
    queryFn: () => getDetailProgram(params.id as string),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });
  return <ProgramForm mode="modify" initialData={data} />;
}
