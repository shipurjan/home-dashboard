import { distance, round } from '@/lib/utils';

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
  onStopPoint: string;
  orderInCourse: number;
  optionalDirection: string;
};

export type BusTimetable = {
  vehicles: Vehicle[];
  offline: boolean;
};

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

  const busTimetable = (await res.json()) as BusTimetable;

  const filteredTable = {
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
        lastPingDate: new Date(vehicle.lastPingDate).toLocaleTimeString(
          'pl-PL'
        ),
        nearestSymbolt: {
          symbol: vehicle.nearestSymbol,
          name: (() => {
            switch (vehicle.nearestSymbol) {
              case '2375':
                return 'Cz-Dz. Silesia';
              case '2376':
                return 'Cz-Dz. Górnicza Węglowa Urząd Skarbowy';
              case '2373':
                return 'Cz-Dz. Węglowa Kościół św. Barbary';
              case '2368':
                return 'Cz-Dz. Traugutta ZSTiL';
              case '2366':
              case '2367':
                return 'Cz-Dz. Dworzec';
              case '2365':
                return 'Cz-Dz. Skwer Stulecia';
              default:
                return '-';
            }
          })()
        },
        distanceToSkwerStuleciaStopPoint:
          round(
            distance(
              49.911,
              19.00582,
              vehicle.latitude,
              vehicle.longitude,
              'K'
            ),
            3
          ) * 1000
      }))
  };
  return Response.json(filteredTable);
}
