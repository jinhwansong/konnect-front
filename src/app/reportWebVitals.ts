'use client';
import { useReportWebVitals } from 'next/web-vitals';

export default function WebVitalsReporter() {
  useReportWebVitals(metric => {
    // metric.name: 'FCP' | 'LCP' | 'CLS' | 'FID' | 'INP' | 'TTFB'
    console.debug(
      `[Web Vital] ${metric.name}: ${metric.value} (${metric.rating})`
    );
  });
  return null;
}
