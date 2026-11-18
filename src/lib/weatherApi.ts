// TODO: review Weather and Weather API. Refactor codes if needed

import { fetchWeatherApi } from 'openmeteo';

const apiUrl = 'https://api.open-meteo.com/v1/forecast';
const latitude = 15.584260432092078;
const longitude = 120.91842047296477;
const params = {
  latitude: [latitude],
  longitude: [longitude],
  current:
    'temperature_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
  hourly: 'temperature_2m,weather_code,is_day,precipitation_probability',
  timezone: 'auto',
  forecast_days: 2,
  temperature_unit: 'celsius',
  wind_speed_unit: 'kmh',
};

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

  const currentTime = toDate(Number(current.time()));
  const hourlyTime = createTimeRange(
    Number(hourly.time()),
    Number(hourly.timeEnd()),
    hourly.interval()
  );
  const temperature = getHourlyValues(hourly, 0, 'temperature');
  const weatherCode = getHourlyValues(hourly, 1, 'weather code');
  const isDay = getHourlyValues(hourly, 2, 'daylight').map(
    value => value === 1
  );
  const precipitationProbability = getHourlyValues(
    hourly,
    3,
    'precipitation probability'
  );

  if (
    hourlyTime.length === 0 ||
    hourlyTime.length !== temperature.length ||
    hourlyTime.length !== weatherCode.length ||
    hourlyTime.length !== isDay.length ||
    hourlyTime.length !== precipitationProbability.length
  ) {
    throw new Error('Open-Meteo returned incomplete hourly weather data.');
  }

  return {
    timezone,
    current: {
      time: currentTime,
      temperature: getCurrentValue(current, 0, 'temperature'),
      apparentTemperature: getCurrentValue(current, 1, 'apparent temperature'),
      isDay: getCurrentValue(current, 2, 'daylight') === 1,
      weatherCode: getCurrentValue(current, 3, 'weather code'),
      windSpeed: getCurrentValue(current, 4, 'wind speed'),
    },
    hourly: {
      time: hourlyTime,
      temperature,
      weatherCode,
      isDay,
      precipitationProbability,
    },
  };
}

function getCurrentValue(
  source: { variables(index: number): { value(): number } | null },
  index: number,
  label: string
) {
  const value = source.variables(index)?.value();
  if (value === undefined || !Number.isFinite(value)) {
    throw new Error(`Open-Meteo did not return ${label}.`);
  }
  return value;
}

function getHourlyValues(
  source: {
    variables(index: number): { valuesArray(): Float32Array | null } | null;
  },
  index: number,
  label: string
) {
  const values = source.variables(index)?.valuesArray();
  if (!values) {
    throw new Error(`Open-Meteo did not return hourly ${label}.`);
  }
  return Array.from(values);
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
  return Array.from({ length }, (_, index) => toDate(start + index * interval));
}

function toDate(timestamp: number) {
  const date = new Date(timestamp * 1000);
  if (Number.isNaN(date.getTime())) {
    throw new Error('Open-Meteo returned an invalid weather timestamp.');
  }
  return date;
}
