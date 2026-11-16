import { Card, CardContent } from '@bettergov/kapwa/card';
import { Link } from 'react-router';
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
      <div className="flex justify-between items-center mb-4">
        <Heading level={2} className="sm:mb-0">
          {t('statistics.title')}
        </Heading>
        <Link
          to="/statistics"
          className="text-sm font-semibold text-primary-700 hover:text-primary-800 flex items-center gap-1 transition-colors"
        >
          {t('statistics.viewProfile')}
          <LucideIcon icon="MoveRight" />
        </Link>
      </div>
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
    <Card className="rounded-none border-0 border-t-4 border-primary-400 bg-gray-50">
      <CardContent className="h-full p-6 flex gap-4">
        <div className="text-primary-600 p-3 rounded-md my-auto">
          <LucideIcon size="lg" icon={icon} />
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
