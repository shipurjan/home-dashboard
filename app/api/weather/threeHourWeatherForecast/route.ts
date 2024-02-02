import { api } from '@/lib/utils';

export type CityCoordWeatherForecast = {
  lat: number;
  lon: number;
};

export type CityWeatherForecast = {
  id: number;
  name: string;
  coord: CityCoordWeatherForecast;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

export type ThreeHourWeatherForecastEntry = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain: {
    '3h': number;
  };
  snow: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
};

export type ThreeHourWeatherForecastResponse = {
  cod: string;
  message: number;
  cnt: number;
  list: ThreeHourWeatherForecastEntry[];
  city: CityWeatherForecast;
};

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET() {
  const res = await api(
    'https://api.openweathermap.org/data/2.5/forecast?' +
      new URLSearchParams({
        appid: process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY ?? '',
        lon: process.env.NEXT_PUBLIC_OPENWEATHERMAP_LONGITUDE ?? '',
        lat: process.env.NEXT_PUBLIC_OPENWEATHERMAP_LATITUDE ?? '',
        units: 'metric',
        lang: 'pl',
        cnt: '17'
      }),
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // revalidate every 15 minutes
      next: { revalidate: 15 * 60 }
    }
  );

  return res;
}
