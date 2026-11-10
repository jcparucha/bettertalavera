import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';

export interface TimelineItem {
  event: string;
  year: string;
  title: string;
  description: string;
}

function TimelineItem({
  event,
  index,
  isLast,
}: {
  event: TimelineItem;
  index: number;
  isLast: boolean;
}) {
  const { year, title, description } = event;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative flex gap-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
    >
      <div className="flex flex-col items-center shrink-0">
        <div className="w-3.5 h-3.5 rounded-full bg-primary-700 border-2 border-white ring-2 ring-primary-200 mt-1 shrink-0 z-10" />
        {isLast && <div className="w-0.5 flex-1 bg-primary-200 mt-1" />}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex-1 hover:shadow-md transition-shadow">
        <span className="inline-block text-xs font-black text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full mb-2 border border-primary-100">
          {year}
        </span>
        <h3 className="font-bold text-gray-900 text-sm mb-1">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function Timeline() {
  const { t } = useTranslation('history');

  const timeline = t('timeline1', { returnObjects: true }) as TimelineItem[];

  return (
    <div className="pl-2">
      {timeline.map((event, index) => (
        <TimelineItem
          key={event.event}
          event={event}
          index={index}
          isLast={index < timeline.length - 1}
        />
      ))}
    </div>
  );
}
