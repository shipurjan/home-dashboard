import { api } from '@/lib/utils';

export type CityCoordWeatherForecast = {
  lat: number;
  lon: number;
};

export type CurrentWeatherResponse = {
  coord: CityCoordWeatherForecast;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  rain: {
    '1h': number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET() {
  const res = await api(
    'https://api.openweathermap.org/data/2.5/weather?' +
      new URLSearchParams({
        appid: process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY ?? '',
        lon: process.env.NEXT_PUBLIC_OPENWEATHERMAP_LONGITUDE ?? '',
        lat: process.env.NEXT_PUBLIC_OPENWEATHERMAP_LATITUDE ?? '',
        units: 'metric',
        lang: 'pl'
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
