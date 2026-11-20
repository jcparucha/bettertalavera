import { fetchWeatherApi } from 'openmeteo';
import type { IconName } from './iconRegistry';

export interface WeatherData {
  timezone: string;
  current: {
    time: Date;
    temperature: number;
    apparentTemperature: number;
    isDay: boolean;
    weatherCode: number;
    windSpeed: number;
  };
  hourly: {
    time: Date[];
    temperature: number[];
    weatherCode: number[];
    isDay: boolean[];
    precipitationProbability: number[];
  };
}

const apiUrl =
  import.meta.env.VITE_OPENMETEO_API_URL ||
  'https://api.open-meteo.com/v1/forecast';
const latitude = import.meta.env.VITE_LOCATION_LATITUDE || 15.584260432092078;
const longitude = import.meta.env.VITE_LOCATION_LONGITUDE || 120.91842047296477;

const params = {
  latitude: [latitude],
  longitude: [longitude],
  timezone: 'Asia/Manila',
  current: [
    'temperature_2m',
    'apparent_temperature',
    'is_day',
    'weather_code',
    'wind_speed_10m',
  ],
  hourly: [
    'temperature_2m',
    'weather_code',
    'is_day',
    'precipitation_probability',
  ],
  forecast_days: 2,
  temperature_unit: 'celsius',
  wind_speed_unit: 'kmh',
};

export async function fetchWeatherData(
  signal: AbortSignal
): Promise<WeatherData> {
  const [response] = await fetchWeatherApi(apiUrl, params, 3, 0.2, 2, {
    signal,
  });

  if (!response) {
    throw new Error('Open-Meteo returned no weather data.');
  }

  const current = response.current();
  const hourly = response.hourly();
  const timezone = response.timezone();

  if (!current || !hourly || !timezone) {
    throw new Error('Open-Meteo returned incomplete weather data.');
  }

  return {
    timezone,
    current: {
      time: new Date(Number(current.time()) * 1000),
      temperature: current.variables(0)!.value(),
      apparentTemperature: current.variables(1)!.value(),
      isDay: current.variables(2)!.value() === 1,
      weatherCode: current.variables(3)!.value(),
      windSpeed: current.variables(4)!.value(),
    },
    hourly: {
      time: createTimeRange(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval()
      ),
      temperature: Array.from(hourly.variables(0)?.valuesArray() ?? []),
      weatherCode: Array.from(hourly.variables(1)?.valuesArray() ?? []),
      isDay: Array.from(hourly.variables(2)?.valuesArray() ?? []).map(
        value => value === 1
      ),
      precipitationProbability: Array.from(
        hourly.variables(3)?.valuesArray() ?? []
      ),
    },
  };
}

function createTimeRange(start: number, end: number, interval: number) {
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    !Number.isFinite(interval) ||
    interval <= 0 ||
    end <= start
  ) {
    throw new Error('Open-Meteo returned an invalid hourly time range.');
  }

  const length = Math.floor((end - start) / interval);

  return Array.from(
    { length },
    (_, index) => new Date((start + index * interval) * 1000)
  );
}

interface WeatherCondition {
  label: string;
  icon: IconName;
}

export function describeWeather(
  code: number,
  isDay: boolean
): WeatherCondition {
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
