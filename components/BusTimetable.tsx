'use client';

import { Bus, BusFront } from 'lucide-react';
import { BusListResponse } from '@/app/api/bus-timetable/bus-list/route';
import { StopPointResponse } from '@/app/api/bus-timetable/stop-point/route';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useDispatch } from '@/lib/hooks/useDispatch';
import { useState } from 'react';

const fetchData = async (url: string) => {
  const response = await fetch(url);
  const res = await response.json();
  return res;
};

export const BusTimetable = () => {
  const [stopPoint, setStopPoint] = useState<StopPointResponse | null>(null);

  useDispatch(
    () => {
      fetchData('/api/bus-timetable/stop-point').then((data) => {
        setStopPoint(data);
      });
    },
    // refetch every minute
    1000 * 60
  );

  const [busList, setBusList] = useState<BusListResponse | null>(null);

  useDispatch(
    () => {
      fetchData('/api/bus-timetable/bus-list').then((data) => {
        setBusList(data);
      });
    },
    // refetch every 5 seconds
    1000 * 5
  );

  return (
    <Table className="caption-top">
      <TableCaption className="m-0">
        <h4>Rozkład autobusów</h4>
        <h5>{stopPoint?.stopPointName}</h5>
        <h5>Kierunek: os. Karpackie</h5>
        <h5>
          Dane z{' '}
          {busList?.vehicles?.length === 0
            ? stopPoint?.responseDate
            : busList?.vehicles.at(0)?.lastPingDate}
        </h5>
      </TableCaption>
      <TableHeader lang="pl-PL" className="[&>th]:hyphens-auto">
        <TableRow className="text-center">
          <TableHead>Linia </TableHead>
          <TableHead className="w-[30px] text-ellipsis ">Czas</TableHead>
          <TableHead className="w-[16ch]">Status</TableHead>
          <TableHead className="w-[18ch]">
            Odległość do Skweru Stulecia [m]
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stopPoint?.departures.map((departure) => {
          const bus = busList?.vehicles.find(
            (b) => b.vehicleId === departure.vehicleId
          );
          return (
            <BusEntry
              key={departure.courseId}
              bus={bus}
              departure={departure}
            />
          );
        })}
      </TableBody>
    </Table>
  );
};

export const BusEntry = ({
  departure,
  bus
}: {
  departure: StopPointResponse['departures'][0];
  bus: BusListResponse['vehicles'][0] | undefined;
}) => {
  return (
    <TableRow key={departure.courseId}>
      <TableCell>{departure.lineName}</TableCell>
      <TableCell>{departure.scheduledDeparture}</TableCell>
      <TableCell>
        <div className="flex flex-col items-center">
          {(() => {
            if (bus === undefined) {
              return 'Na kursie w stronę Czechowic';
            }
            if (bus.onStopPoint.symbol !== null) {
              return (
                <>
                  <BusFront />
                  {`Stoi na ${bus?.onStopPoint.name}`}
                </>
              );
            } else {
              return (
                <>
                  <Bus />
                  {`Jedzie do ${bus?.nearestSymbol.name}`}
                </>
              );
            }
          })()}
        </div>
      </TableCell>
      <TableCell>
        {bus?.nearestSymbol.symbol === '2365'
          ? bus.distanceToNearestStopPoint
          : bus?.distanceToSkwerStuleciaStopPoint}
      </TableCell>
    </TableRow>
  );
};
