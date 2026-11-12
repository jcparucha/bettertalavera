import { Card, CardContent } from '@bettergov/kapwa/card';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import { useTranslation } from '../../../hooks/useTranslation';
import LucideIcon from '../../ui/LucideIcon';
import { Text } from '../../ui/Text';

export interface FactItem {
  icon: string;
  title: string;
  description: string;
}

function FactItem({ fact, index }: { fact: FactItem; index: number }) {
  const { ref, visible } = useIntersectionObserver();

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.5s ease ${index * 80}ms, transform 0.5s ease ${index * 80}ms`,
      }}
    >
      <Card className="border-t-4 border-primary-500" key={index} hoverable>
        <CardContent className="h-full p-6 flex gap-4">
          <div className="bg-primary-100 text-primary-600 p-3 rounded-md w-12 h-12">
            <LucideIcon icon={fact.icon} />
          </div>
          <div className="space-y-2 grow">
            <h3 className="text-lg font-semibold text-gray-900 self-center">
              {fact.title}
            </h3>
            <Text className="text-gray-800 sm:max-w-full">
              {fact.description}
            </Text>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Facts() {
  const { t } = useTranslation('history');

  const facts = t('facts', { returnObjects: true }) as FactItem[];

  return (
    <div className="space-y-4">
      {facts.map((fact, index) => (
        <FactItem fact={fact} index={index} />
      ))}
    </div>
  );
}
