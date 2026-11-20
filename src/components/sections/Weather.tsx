import { Card, CardContent } from '@bettergov/kapwa/card';
import { formatDistanceToNowStrict } from 'date-fns';
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

  const { current, hourly, timezone } = weather;

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

  return (
    <div
      className={`h-full bg-linear-to-tl from-primary-50/25 to-white ${className}`}
    >
      <div className="flex h-full flex-col p-5">
        <div className="flex justify-between text-gray-600">
          <p className="text-sm font-semibold">Weather Forecast</p>
          <p className="text-sm">
            Updated{' '}
            {formatDistanceToNowStrict(current.time, { addSuffix: true })}
          </p>
        </div>

        <div className="flex gap-2 my-auto p-4">
          <div>
            <h1 className="text-6xl md:text-5xl font-semibold text-primary-600">
              {Math.round(weather.current.temperature)}°C
            </h1>
            <p className="text-lg md:text-md text-gray-700 font-medium">
              {currentCondition.label}
            </p>
            <p className="text-md md:text-sm text-gray-700">
              Feels like&nbsp;{Math.round(current.apparentTemperature)}°C
            </p>
          </div>
          <div className="text-primary-600" aria-hidden="true">
            <LucideIcon icon={currentCondition.icon} size="lg" />
          </div>
        </div>

        <div className="flex justify-evenly border-t border-primary-200 py-2">
          <div
            className="flex items-center gap-1 text-gray-600 cursor-pointer"
            title="Rain chance"
          >
            <p className="flex text-sm text-gray-600">
              <span className="text-primary-400 mr-1">
                <LucideIcon size="sm" icon="Droplets" />
              </span>
              <span>Rain Chance:</span>
            </p>
            <span className="text-sm font-semibold text-gray-900">
              {rainChance === null ? '—' : `${rainChance}%`}
            </span>
          </div>
          <div
            className="flex items-center gap-1 text-gray-600 cursor-pointer"
            title="Wind speed"
          >
            <p className="flex text-sm text-gray-600">
              <span className="text-primary-400 mr-1">
                <LucideIcon size="sm" icon="Wind" />
              </span>
              <span>Wind:</span>
            </p>

            <span className="text-sm font-semibold text-gray-900">
              {Math.round(current.windSpeed)} km/h
            </span>
          </div>
        </div>

        <div className="border-t border-primary-200 pt-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">
            Next 5 hours
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {forecast.map(({ time, temperature, code, isDay }) => {
              const condition = describeWeather(code, isDay);

              return (
                <div
                  key={time.toISOString()}
                  className="rounded-md bg-primary-50/25 px-1 py-2 text-center"
                >
                  <p className="text-md font-semibold text-gray-900">
                    {Math.round(temperature)}°
                  </p>
                  <div
                    className="my-1 flex justify-center text-primary-600"
                    aria-label={condition.label}
                  >
                    <LucideIcon icon={condition.icon} size="md" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">
                    {formatHour(time, timezone)}
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
