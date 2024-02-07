import { distance, getStopPointName, round } from '@/lib/utils';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';

export type Vehicle = {
  lineName: string;
  courseLoid: number;
  dayCourseLoid: number;
  vehicleId: string;
  delaySec: string | number | null;
  longitude: number;
  latitude: number;
  angle: number;
  reachedMeters: number;
  variantLoid: number;
  lastPingDate: number;
  distanceToNearestStopPoint: number;
  nearestSymbol: string;
  operator: string;
  onStopPoint: string | null;
  orderInCourse: number;
  optionalDirection: string;
};

export type BusList = {
  vehicles: Vehicle[];
  offline: boolean;
};

const getFilteredResponse = (busTimetable: BusList) => ({
  ...busTimetable,
  vehicles: busTimetable.vehicles
    .filter(
      (vehicle) =>
        vehicle.lineName === '50' &&
        // vehicle.optionalDirection === 'Os. Karpackie'
        Number(vehicle.nearestSymbol) >= 2365
    )
    .map((vehicle) => ({
      ...vehicle,
      lastPingDate: format(vehicle.lastPingDate, 'HH:mm:ss', {
        locale: pl
      }),
      nearestSymbol: {
        symbol: vehicle.nearestSymbol,
        name: getStopPointName(vehicle.nearestSymbol)
      },
      onStopPoint: {
        symbol: vehicle.onStopPoint,
        name: getStopPointName(vehicle.onStopPoint)
      },
      distanceToSkwerStuleciaStopPoint:
        round(
          distance(49.911, 19.00582, vehicle.latitude, vehicle.longitude, 'K'),
          3
        ) * 1000
    }))
});
export type BusListResponse = ReturnType<typeof getFilteredResponse>;

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET() {
  const res = await fetch(
    'https://rozklady.bielsko.pl/getRunningVehicles.json',
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // revalidate every 5 seconds
      next: { revalidate: 5 }
    }
  );

  const busTimetable = (await res.json()) as BusList;

  return Response.json(getFilteredResponse(busTimetable));
}
