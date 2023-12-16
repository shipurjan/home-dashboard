import { api } from '@/lib/utils';

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
