import { Card, CardContent } from '@bettergov/kapwa/card';
import { useTranslation } from '../../hooks/useTranslation';
import { Heading } from '../ui/Heading';
import LucideIcon from '../ui/LucideIcon';
import Section from '../ui/Section';
import { Text } from '../ui/Text';

type StateBasicKey = 'population' | 'barangays' | 'classification' | 'landArea';

interface StatBasicItem {
  label: string;
  value: string | number;
  description: string;
  unit?: string;
}

export default function StatisticsSection() {
  const { t } = useTranslation();

  const basicInfo = t('statistics.basic', { returnObjects: true }) as Record<
    StateBasicKey,
    StatBasicItem
  >;

  return (
    <Section>
      <Heading level={2}>{t('statistics.title')}</Heading>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard value={basicInfo.population} icon="Users" />
        <StatCard value={basicInfo.barangays} icon="MapPinned" />
        <StatCard value={basicInfo.classification} icon="Landmark" />
        <StatCard value={basicInfo.landArea} icon="Ruler" />
      </div>
    </Section>
  );
}

function StatCard({
  value: { label, description, value, unit },
  icon,
}: {
  value: StatBasicItem;
  icon: string;
}) {
  return (
    <Card className="border-t-4 border-primary-500">
      <CardContent className="h-full p-6 flex gap-4">
        <div className="text-primary-600 p-3 rounded-md w-12 h-12">
          <LucideIcon icon={icon} />
        </div>
        <div className="">
          <h3 className="text-2xl lg:text-xl font-semibold text-primary-600 self-center">
            {typeof value === 'number'
              ? Intl.NumberFormat('en-PH').format(value)
              : value}
            &nbsp;
            {unit || ''}
          </h3>
          <h5 className="text-md text-gray-900 font-bold sm:max-w-full">
            {label}
          </h5>
          <Text size="sm" className="text-gray-600 italic sm:max-w-full">
            {description}
          </Text>
        </div>
      </CardContent>
    </Card>
  );
}
