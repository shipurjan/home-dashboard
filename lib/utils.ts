import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const round = (number: number, precision: number = 0) => {
  return +number.toFixed(precision);
};

export async function api(input: string | URL | Request, init?: RequestInit) {
  const res = await fetch(input, init);
  const data = await res.json();
  return Response.json({ data });
}

export function distance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  unit: string
) {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    const lat1_rad = (Math.PI * lat1) / 180;
    const lat2_rad = (Math.PI * lat2) / 180;
    const t = lon1 - lon2;
    const t_rad = (Math.PI * t) / 180;
    let dist =
      Math.sin(lat1_rad) * Math.sin(lat2_rad) +
      Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.cos(t_rad);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'K') {
      dist = dist * 1.609344;
    }
    if (unit == 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  }
}
