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

export const dynamic = 'force-dynamic'; // defaults to auto
export async function GET() {
  const res = await fetch(
    'https://rozklady.bielsko.pl/getRealtime.json?stopPointSymbol=2365',
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // revalidate every 5 seconds
      next: { revalidate: 15 }
    }
  );
  const stopPoint = (await res.json()) as StopPoint;
  const filteredPoint = {
    ...stopPoint,
    responseDate: new Date(stopPoint.responseDate).toLocaleTimeString('pl-PL'),
    departures: stopPoint.departures.map((departure) => ({
      ...departure,
      scheduledDeparture: new Date(
        departure.scheduledDeparture
      ).toLocaleTimeString('pl-PL'),
      realDeparture: new Date(departure.realDeparture).toLocaleTimeString(
        'pl-PL'
      )
    }))
  };
  return Response.json(filteredPoint);
}
