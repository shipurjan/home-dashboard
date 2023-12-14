'use client';

import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Clock } from './Clock';
import 'moment/locale/pl';
import { Card, CardContent } from '@/components/ui/card';

export const Dashboard = () => {
  const [date, setDate] = useState(new Date());
  const interval_ms = 60 * 1000;

  useEffect(() => {
    const timeout = setInterval(() => setDate(new Date()), interval_ms);

    return () => {
      clearInterval(timeout);
    };
  }, [interval_ms]);

  return (
    <div className="flex min-h-screen min-w-full flex-row gap-2 items-start p-2">
      <div>
        <Card>
          <CardContent>
            <Clock interval={interval_ms} />
          </CardContent>
        </Card>
      </div>
      <Calendar fixedWeeks showOutsideDays selected={date} />
    </div>
  );
};
