'use client';

import './Clock.css';
import ReactClock, { ClockProps as ReactClockProps } from 'react-clock';
import ReactLiveClock from 'react-live-clock';

export type ClockProps = ReactClockProps;
export const Clock = ({ value }: ClockProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <ReactClock value={value} />
      <ReactLiveClock
        format={'HH:mm:ss'}
        ticking={true}
        timezone={'Europe/Warsaw'}
      />
    </div>
  );
};
