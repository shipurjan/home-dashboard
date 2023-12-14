'use client';

import { useEffect, useState } from 'react';
import { Calendar } from './Calendar';
import { Clock } from './Clock';

export const CalendarAndClock = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center justify-center gap-8 p-24">
      <Clock value={date} />
      <Calendar value={date} />
    </div>
  );
};
