'use client';

import { useEffect, useState } from 'react';
import { Calendar } from './Calendar';
import { Clock } from './Clock';
import 'moment/locale/pl';

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
    <div className="flex min-h-screen min-w-full flex-col items-center justify-between">
      <div className=" self-start">
        <Clock interval={interval_ms} />
      </div>
      <Calendar value={date} />
    </div>
  );
};
