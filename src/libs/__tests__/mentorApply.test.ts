import { ApplyRequest } from '@/types/apply';
import { MessageResponse } from '@/types/user';
import { fetcher } from '@/utils/fetcher';

import { submitMentorApplication } from '../mentorApply';

// fetcher mock
jest.mock('@/utils/fetcher');
const mockFetcher = fetcher as jest.MockedFunction<typeof fetcher>;

describe('mentorApply', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('postMentorApplication', () => {
    it('should submit mentor application', async () => {
      const applicationData: ApplyRequest = {
        company: 'Test Company',
        position: 'Senior Developer',
        career: 'd',
        expertise: ['React', 'Node.js'],
        introduce: 'dd',
        portfolio: 'ddd',
      };
      const mockResponse: MessageResponse = {
        message: '신청이 완료되었습니다.',
      };

      mockFetcher.mockResolvedValueOnce(mockResponse);

      const result = await submitMentorApplication(applicationData);

      expect(mockFetcher).toHaveBeenCalledWith('mentor/apply', {
        method: 'POST',
        body: JSON.stringify(applicationData),
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
