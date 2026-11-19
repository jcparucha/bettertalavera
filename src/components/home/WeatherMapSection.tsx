import Map from '../sections/Map';
import Weather from '../sections/Weather';
import Section from '../ui/Section';

export default function WeatherMapSection() {
  return (
    <Section>
      <div className="grid gap-4 lg:grid-cols-3">
        <Weather className="col-span-1 rounded-lg border border-gray-300 shadow shadow-gray-300" />
        <Map className="col-span-2 rounded-lg border border-gray-300 shadow shadow-gray-300" />
      </div>
    </Section>
  );
}
