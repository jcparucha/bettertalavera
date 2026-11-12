import { Card, CardContent } from '@bettergov/kapwa/card';
import { useTranslation } from '../../../hooks/useTranslation';
import LucideIcon from '../../ui/LucideIcon';
import { Text } from '../../ui/Text';

export interface FactItem {
  icon: string;
  title: string;
  description: string;
}

export default function Facts() {
  const { t } = useTranslation('history');

  const facts = t('facts', { returnObjects: true }) as FactItem[];

  return (
    <div className="space-y-4">
      {facts.map((fact, index) => (
        <Card hoverable className="border-t-4 border-primary-500" key={index}>
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
      ))}
    </div>
  );
}
