import { api } from '@/lib/utils';

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
      // revalidate every 30 minutes
      next: { revalidate: 30 * 60 }
    }
  );

  return res;
}
