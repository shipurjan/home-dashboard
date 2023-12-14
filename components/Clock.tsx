'use client';

import './Clock.css';
import ReactLiveClock from 'react-live-clock';

export type ClockProps = {
  interval: number;
};
export const Clock = ({ interval }: ClockProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <ReactLiveClock
        interval={interval}
        className="text-6xl"
        format={'HH:mm\0dddd'}
        ticking={true}
        locale="es"
        timezone={'Europe/Warsaw'}
        // @ts-expect-error filter has wrong typings, but works properly according to docs
        filter={(date: string) => {
          const [time, weekday] = date.split('\0');
          return (
            <div>
              <div>
                {time.split(':').map((timeChunk, idx) => (
                  <span key={idx}>
                    {idx !== 0 && <span className="animate-pulse-time">:</span>}
                    {timeChunk}
                  </span>
                ))}
              </div>
              <div>{weekday}</div>
            </div>
          );
        }}
      />
    </div>
  );
};
