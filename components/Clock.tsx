'use client';

import { cn } from '@/lib/utils';
import './Clock.css';
import ReactLiveClock from 'react-live-clock';

export type ClockProps = React.HTMLAttributes<HTMLDivElement> & {
  interval: number;
};
export const Clock = ({ interval, className, ...props }: ClockProps) => {
  return (
    <ReactLiveClock
      interval={interval}
      className=""
      format={'HH:mm\0dddd'}
      ticking={true}
      locale="es"
      timezone={'Europe/Warsaw'}
      // @ts-expect-error filter has wrong typings, but works properly according to docs
      filter={(date: string) => {
        const [time, weekday] = date.split('\0');
        return (
          <div
            {...props}
            className={cn(
              'flex flex-col items-center justify-center',
              className
            )}>
            <div className="font-bold">
              {time.split(':').map((timeChunk, idx) => (
                <span key={idx}>
                  {idx !== 0 && <span className="animate-pulse-time">:</span>}
                  {timeChunk}
                </span>
              ))}
            </div>
            <div style={{ fontSize: '0.667em' }} className=" font-medium">
              {weekday}
            </div>
          </div>
        );
      }}
    />
  );
};
