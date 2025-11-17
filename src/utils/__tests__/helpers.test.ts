import { formatDate, formatDuration, buildImageUrl } from '../helpers';

describe('helpers', () => {
  it('formatDate returns yy.MM.dd style', () => {
    expect(formatDate('2023-12-25')).toBe('23.12.25');
    expect(formatDate(new Date('2023-12-25'))).toBe('23.12.25');
  });

  it('formatDuration returns minutes style', () => {
    expect(formatDuration(30)).toBe('30분');
    expect(formatDuration(90)).toBe('90분'); // 앱 로직 그대로
  });

  it('buildImageUrl prepends localhost base', () => {
    expect(buildImageUrl('/uploads/image.jpg')).toBe(
      'http://localhost:3000/uploads/image.jpg'
    );
  });
});
