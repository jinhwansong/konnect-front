import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

import { withQueryDefaults } from '@/hooks/query/options';
import {
  removeReview,
  fetchMenteeReviews,
  fetchMentorReviews,
  updateReview,
  createReview,
} from '@/libs/review';
import { PatchReview, ReviewRequest, ReviewResponse } from '@/types/review';

export const usePostReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ReviewRequest) => createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['review-mentee'],
      });
      queryClient.invalidateQueries({
        queryKey: ['review-mentor'],
      });
      queryClient.invalidateQueries({
        queryKey: ['review-detail'],
      });
      queryClient.invalidateQueries({
        queryKey: ['reservation-my'],
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['review-mentee'],
      });
      queryClient.invalidateQueries({
        queryKey: ['review-mentor'],
      });
      queryClient.invalidateQueries({
        queryKey: ['review-detail'],
      });
      queryClient.invalidateQueries({
        queryKey: ['reservation-my'],
      });
    },
  });
};

export const usePatchReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: PatchReview) => updateReview(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['review-mentee'],
      });
      queryClient.invalidateQueries({
        queryKey: ['review-mentor'],
      });
      queryClient.invalidateQueries({
        queryKey: ['review-detail'],
      });
    },
  });
};

export const useGetMentorReview = (page: number) => {
  const { data: session } = useSession();
  return useQuery<ReviewResponse>(
    withQueryDefaults({
      queryKey: ['review-mentor', page],
      queryFn: () => fetchMentorReviews(page),
      enabled: !!session?.user,
    })
  );
};
export const useGetMenteeReview = (page: number) => {
  const { data: session } = useSession();
  return useQuery<ReviewResponse>(
    withQueryDefaults({
      queryKey: ['review-mentee', page],
      queryFn: () => fetchMenteeReviews(page),
      enabled: !!session?.user,
    })
  );
};
