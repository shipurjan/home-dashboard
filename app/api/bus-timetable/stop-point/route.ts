import { getStopPointName } from '@/lib/utils';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';

export type Departure = {
  courseId: number;
  scheduledDepartureSec: number;
  scheduledDeparture: number;
  realDeparture: number;
  vehicleId: string;
  variantId: number;
  orderInCourse: number;
  passed: boolean;
  lack: boolean;
  onStopPoint: boolean;
  lineName: string;
  directionName: string;
};

export type StopPoint = {
  stopPointSymbol: string;
  stopPointId: number;
  stopPointName: string;
  responseDate: number;
  departures: Departure[];
  error: unknown;
};

const getFilteredResponse = (stopPoint: StopPoint) => ({
  ...stopPoint,
  stopPointName: getStopPointName(stopPoint.stopPointSymbol),
  responseDate: format(stopPoint.responseDate, 'HH:mm:ss', {
    locale: pl
  }),
  departures: stopPoint.departures.map((departure) => ({
    ...departure,
    scheduledDeparture: format(departure.scheduledDeparture, 'HH:mm', {
      locale: pl
    }),
    realDeparture: format(departure.realDeparture, 'HH:mm', {
      locale: pl
    })
  }))
});

export type StopPointResponse = ReturnType<typeof getFilteredResponse>;

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET() {
  const res = await fetch(
    'https://rozklady.bielsko.pl/getRealtime.json?stopPointSymbol=2365',
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // revalidate every minute
      next: { revalidate: 60 }
    }
  );
  const stopPoint = (await res.json()) as StopPoint;
  return Response.json(getFilteredResponse(stopPoint));
}
