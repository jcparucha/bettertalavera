import { Card, CardContent } from '@bettergov/kapwa/card';
import { useEffect, useState } from 'react';
import { formatHour } from '../../lib/utils';
import {
  describeWeather,
  fetchWeatherData,
  type WeatherData,
} from '../../lib/weather';
import LucideIcon from '../ui/LucideIcon';

export default function Weather({ className }: { className?: string }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWeather() {
      try {
        const data = await fetchWeatherData(controller.signal);
        setWeather(data);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load weather data.'
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadWeather();

    return () => controller.abort();
  }, [retryCount]);

  if (loading) return <WeatherSkeleton />;

  if (error || !weather) {
    return (
      <WeatherUnavailable
        error={error}
        onClick={() => {
          setLoading(true);
          setError(null);
          setRetryCount(count => count + 1);
        }}
      />
    );
  }

  const { current, hourly } = weather;

  const currentCondition = describeWeather(current.weatherCode, current.isDay);

  const currentHour = Math.floor(current.time.getTime() / 3_600_000);

  const currentHourIndex = hourly.time.findIndex(
    time => Math.floor(time.getTime() / 3_600_000) === currentHour
  );

  const rainChance =
    currentHourIndex >= 0
      ? hourly.precipitationProbability[currentHourIndex]
      : null;

  const nextHourIndex = hourly.time.findIndex(
    time => time.getTime() > current.time.getTime()
  );

  const forecastStartIndex =
    nextHourIndex >= 0 ? nextHourIndex : hourly.time.length;

  const forecast = hourly.time
    .slice(forecastStartIndex, forecastStartIndex + 5)
    .map((time, index) => {
      const forecastIndex = forecastStartIndex + index;

      return {
        time,
        temperature: hourly.temperature[forecastIndex],
        code: hourly.weatherCode[forecastIndex],
        isDay: hourly.isDay[forecastIndex],
      };
    });

  const updatedAt = current.time.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`h-full ${className}`}>
      <div className="flex h-full flex-col p-5">
        {/* <h2 className="text-lg font-semibold text-gray-900">
          Talavera Weather
        </h2> */}
        {/* <Heading level={6}>Talavera Weather</Heading> */}
        <div className="flex justify-between text-gray-600">
          <p className="text-sm flex gap-1 items-center">
            <span className="text-primary-400">
              <LucideIcon size="sm" icon="MapPin" />
            </span>
            Talavera, Nueva Ecija
          </p>
          <p className="text-sm ">Updated at&nbsp;{updatedAt}</p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            {/* <p className="text-sm text-gray-600">Current conditions</p> */}
            <p className="text-4xl font-semibold text-primary-600">
              {Math.round(weather.current.temperature)}°C
            </p>
            <p className="text-sm text-gray-700">{currentCondition.label}</p>
          </div>
          <div className="text-primary-600" aria-hidden="true">
            <LucideIcon icon={currentCondition.icon} size="lg" />
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-md shadow bg-gray-50 p-3">
            <dt className="text-gray-600">Rain chance</dt>
            <dd className="mt-1 font-semibold text-gray-900">
              {rainChance === null ? '—' : `${rainChance}%`}
            </dd>
          </div>
          <div className="rounded-md bg-gray-50 p-3">
            <dt className="text-gray-600">Wind</dt>
            <dd className="mt-1 font-semibold text-gray-900">
              {Math.round(current.windSpeed)} km/h
            </dd>
          </div>
          <div className="rounded-md bg-gray-50 p-3">
            <dt className="text-gray-600">Feels like</dt>
            <dd className="mt-1 font-semibold text-gray-900">
              {Math.round(current.apparentTemperature)}°C
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-gray-300 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Next 5 hours
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map(({ time, temperature, code, isDay }) => {
              const condition = describeWeather(code, isDay);

              return (
                <div
                  key={time.toISOString()}
                  className="rounded-md bg-gray-50 px-1 py-2 text-center"
                >
                  <p className="text-xs font-medium text-gray-700">
                    {formatHour(time, weather.timezone)}
                  </p>
                  <div
                    className="my-1 flex justify-center text-primary-600"
                    aria-label={condition.label}
                  >
                    <LucideIcon icon={condition.icon} size="sm" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">
                    {Math.round(temperature)}°
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function WeatherSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="h-full rounded-lg"
    >
      <Card className="h-full">
        <CardContent className="animate-pulse space-y-5 p-5">
          <span className="sr-only">Loading Talavera weather forecast</span>
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="h-20 rounded bg-gray-200" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-14 rounded bg-gray-200" />
            <div className="h-14 rounded bg-gray-200" />
            <div className="h-14 rounded bg-gray-200" />
          </div>
          <div className="h-16 rounded bg-gray-200" />
        </CardContent>
      </Card>
    </div>
  );
}

function WeatherUnavailable({
  error,
  onClick,
}: {
  error: string | null;
  onClick: () => void;
}) {
  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col items-start justify-center gap-3 p-6">
        <h2 className="text-lg font-semibold text-gray-900">
          Weather unavailable
        </h2>
        <p role="alert" className="text-sm text-gray-700">
          {error ?? 'Unable to load weather data.'}
        </p>
        <button
          type="button"
          onClick={onClick}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Try again
        </button>
      </CardContent>
    </Card>
  );
}
