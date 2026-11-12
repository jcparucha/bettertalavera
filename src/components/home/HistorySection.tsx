import { useTranslation } from '../../hooks/useTranslation';
import { Heading } from '../ui/Heading';
import Section from '../ui/Section';
import Facts from './history/Facts';
import Timeline from './history/Timeline';

export default function HistorySection() {
  const { t } = useTranslation('history');

  console.log('TIMELINE', t('timeline.augustinian_missions'));

  return (
    <Section>
      <Heading level={2}>{t('title')}</Heading>
      <div className="grid lg:grid-cols-3 gap-4">
        <Timeline className="lg:col-span-2" />
        <Facts />
      </div>
    </Section>
  );
}
