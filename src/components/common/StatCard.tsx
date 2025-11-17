'use client';

interface StatCardProps {
  title: string;
  value: string | number;
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  subText?: string;
}

export default function StatCard({
  title,
  value,
  changeLabel,
  trend = 'neutral',
  subText,
}: StatCardProps) {
  const trendColor =
    trend === 'up'
      ? 'text-[var(--color-success)]'
      : trend === 'down'
        ? 'text-[var(--color-danger)]'
        : 'text-[var(--text-sub)]';

  return (
    <article className="rounded-[var(--radius-lg,1rem)] border border-[var(--border-color)] bg-[var(--card-bg)] p-6 shadow-sm transition duration-200 hover:shadow-md">
      <p className="text-xs font-medium tracking-wide text-[var(--text-sub)] uppercase">
        {title}
      </p>
      <p className="mt-3 text-2xl font-semibold text-[var(--text-bold)]">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      {changeLabel && (
        <p className={`mt-2 text-xs font-medium ${trendColor}`}>
          {changeLabel}
        </p>
      )}
      {subText && (
        <p className="mt-2 text-xs text-[var(--text-sub)]">{subText}</p>
      )}
    </article>
  );
}
