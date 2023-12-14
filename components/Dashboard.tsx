'use client';

import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Clock } from './Clock';
import 'moment/locale/pl';
import { Card, CardContent } from '@/components/ui/card';
import { WeatherForecast } from './WeatherForecast';
import { useLoaded } from '@/lib/hooks/useLoaded';

export const Dashboard = () => {
  const loaded = useLoaded();
  const [date, setDate] = useState(new Date());
  const interval_ms = 60 * 1000;

  useEffect(() => {
    const timeout = setInterval(() => setDate(new Date()), interval_ms);

    return () => {
      clearInterval(timeout);
    };
  }, [interval_ms]);

  if (!loaded) return <></>;
  return (
    <div className="flex flex-wrap gap-2 m-2 w-full h-full place-items-start">
      {[
        <Clock key={'clock'} interval={interval_ms} />,
        <Calendar
          key={'calendar'}
          fixedWeeks
          showOutsideDays
          selected={date}
        />,
        <WeatherForecast key={'weather_forecast'} />
      ].map((e) => (
        <Card key={e.key}>
          <CardContent>{e}</CardContent>
        </Card>
      ))}
    </div>
  );
};
