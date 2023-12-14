'use client';

import { useEffect, useState } from 'react';
import { Calendar } from './Calendar';
import { Clock } from './Clock';

export const CalendarAndClock = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-around gap-24 p-24">
      <Clock value={date} />
      <Calendar value={date} />
    </div>
  );
};
