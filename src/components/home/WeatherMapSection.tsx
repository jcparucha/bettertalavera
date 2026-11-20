import Map from '../sections/Map';
import Weather from '../sections/Weather';
import Section from '../ui/Section';

export default function WeatherMapSection() {
  return (
    <Section>
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Weather className="col-span-1 rounded-lg border border-primary-100 shadow shadow-primary-100" />
        <Map className="sm:col-span-1 lg:col-span-2 rounded-lg border border-gray-300 shadow shadow-gray-300" />
      </div>
    </Section>
  );
}
