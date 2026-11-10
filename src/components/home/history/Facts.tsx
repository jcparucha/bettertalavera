import { Card, CardContent, CardHeader } from '@bettergov/kapwa/card';
import { useTranslation } from '../../../hooks/useTranslation';
import LucideIcon from '../../ui/LucideIcon';

export interface FactItem {
  icon: string;
  title: string;
  description: string;
}

export default function Facts() {
  const { t } = useTranslation('history');

  const facts = t('facts', { returnObjects: true }) as FactItem[];

  return (
    <div>
      <Card>
        <CardHeader>{t('facts.0.title')}</CardHeader>
        <CardContent>{t('facts.0.description')}</CardContent>
      </Card>

      {facts.map((fact, index) => {
        return (
          <div key={index} className="history-card">
            <div className="history-card-icon">
              <LucideIcon icon={fact.icon} />
            </div>
            <div className="history-card-content">
              <h4>{fact.title}</h4>
              <p>{fact.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
