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
  const interval_ms = 15 * 1000;

  useEffect(() => {
    const timeout = setInterval(() => setDate(new Date()), interval_ms);

    return () => {
      clearInterval(timeout);
    };
  }, [interval_ms]);

  if (!loaded) return <></>;
  return (
    <div className="flex flex-col gap-2 w-full h-full justify-between place-items-center">
      <Card>
        <CardContent>
          <Clock key={'clock'} interval={interval_ms} />
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Calendar
            key={'calendar'}
            fixedWeeks
            showOutsideDays
            selected={date}
          />
        </CardContent>
      </Card>
      <WeatherForecast key={'weather_forecast'} />
    </div>
  );
};
