import { Card, CardContent } from '@bettergov/kapwa/card';
import { useEffect, useState } from 'react';
import { formatHour } from '../../lib/utils';
import { fetchWeatherData, type WeatherData } from '../../lib/weatherApi';
import LucideIcon from '../ui/LucideIcon';

interface WeatherCondition {
  label: string;
  icon: string;
}

export default function Weather() {
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
            onClick={() => {
              setLoading(true);
              setError(null);
              setRetryCount(count => count + 1);
            }}
            className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
          >
            Try again
          </button>
        </CardContent>
      </Card>
    );
  }

  const currentCondition = describeWeather(
    weather.current.weatherCode,
    weather.current.isDay
  );
  const currentHour = Math.floor(weather.current.time.getTime() / 3_600_000);
  const currentHourIndex = weather.hourly.time.findIndex(
    time => Math.floor(time.getTime() / 3_600_000) === currentHour
  );
  const rainChance =
    currentHourIndex >= 0
      ? weather.hourly.precipitationProbability[currentHourIndex]
      : null;
  const nextHourIndex = weather.hourly.time.findIndex(
    time => time.getTime() > weather.current.time.getTime()
  );
  const forecastStartIndex =
    nextHourIndex >= 0 ? nextHourIndex : weather.hourly.time.length;
  const forecast = weather.hourly.time
    .slice(forecastStartIndex, forecastStartIndex + 5)
    .map((time, index) => {
      const forecastIndex = forecastStartIndex + index;

      return {
        time,
        temperature: weather.hourly.temperature[forecastIndex],
        code: weather.hourly.weatherCode[forecastIndex],
        isDay: weather.hourly.isDay[forecastIndex],
      };
    });

  console.log(weather);

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Talavera Weather
        </h2>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600">Current conditions</p>
            <p className="text-4xl font-semibold text-gray-900">
              {Math.round(weather.current.temperature)}°C
            </p>
            <p className="text-sm text-gray-700">{currentCondition.label}</p>
          </div>
          <div className="text-primary-600" aria-hidden="true">
            <LucideIcon icon={currentCondition.icon} size="lg" />
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-md bg-gray-50 p-3">
            <dt className="text-gray-600">Rain chance</dt>
            <dd className="mt-1 font-semibold text-gray-900">
              {rainChance === null ? '—' : `${rainChance}%`}
            </dd>
          </div>
          <div className="rounded-md bg-gray-50 p-3">
            <dt className="text-gray-600">Wind</dt>
            <dd className="mt-1 font-semibold text-gray-900">
              {Math.round(weather.current.windSpeed)} km/h
            </dd>
          </div>
          <div className="rounded-md bg-gray-50 p-3">
            <dt className="text-gray-600">Feels like</dt>
            <dd className="mt-1 font-semibold text-gray-900">
              {Math.round(weather.current.apparentTemperature)}°C
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-gray-200 pt-4">
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
      </CardContent>
    </Card>
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

function describeWeather(code: number, isDay: boolean): WeatherCondition {
  if (code === 0) {
    return { label: 'Clear sky', icon: isDay ? 'Sun' : 'Moon' };
  }
  if (code === 1) {
    return { label: 'Mainly clear', icon: isDay ? 'Sun' : 'Moon' };
  }
  if (code === 2) {
    return { label: 'Partly cloudy', icon: isDay ? 'CloudSun' : 'Cloud' };
  }
  if (code === 3) return { label: 'Overcast', icon: 'Cloud' };
  if ([45, 48].includes(code)) return { label: 'Foggy', icon: 'Cloud' };
  if ([51, 53, 55, 56, 57].includes(code)) {
    return { label: 'Drizzle', icon: 'CloudDrizzle' };
  }
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return { label: 'Rain', icon: 'CloudRain' };
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return { label: 'Snow', icon: 'CloudSnow' };
  }
  if ([95, 96, 99].includes(code)) {
    return { label: 'Thunderstorm', icon: 'CloudLightning' };
  }
  return { label: 'Conditions unavailable', icon: 'Cloud' };
}
