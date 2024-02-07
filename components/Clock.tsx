'use client';

import { cn } from '@/lib/utils';
import ReactLiveClock from 'react-live-clock';
import { Separator } from './ui/separator';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';

export type ClockProps = React.HTMLAttributes<HTMLDivElement> & {
  interval: number;
  date: Date;
};
export const Clock = ({
  interval,
  date: currentTimestamp,
  className,
  ...props
}: ClockProps) => {
  return (
    <div suppressHydrationWarning>
      <ReactLiveClock
        interval={interval}
        className=""
        format={'HH:mm:ss\0dddd'}
        ticking={true}
        locale="pl"
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
              <h2>
                {time.split(':').map((timeChunk, idx) => (
                  <span key={idx}>
                    {idx !== 0 && <span className="animate-pulse-time">:</span>}
                    {timeChunk}
                  </span>
                ))}
              </h2>
              <Separator className="my-1" />
              <h4>
                {format(currentTimestamp, 'dd.MM.yyyy', {
                  locale: pl
                })}{' '}
                {weekday}
              </h4>
            </div>
          );
        }}
      />
    </div>
  );
};
