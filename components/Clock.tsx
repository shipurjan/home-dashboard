'use client';

import './Clock.css';
import ReactClock, { ClockProps as ReactClockProps } from 'react-clock';
import ReactLiveClock from 'react-live-clock';

export type ClockProps = ReactClockProps;
export const Clock = ({ value, ...props }: ClockProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <ReactClock
        renderSecondHand={false}
        value={value}
        minuteHandLength={80}
        minuteHandOppositeLength={10}
        hourHandLength={55}
        hourHandOppositeLength={10}
        hourHandWidth={6}
        size={400}
        {...props}
      />
      <ReactLiveClock
        interval={60000}
        className="text-5xl"
        format={'HH:mm'}
        ticking={true}
        blinking={'all'}
        timezone={'Europe/Warsaw'}
      />
    </div>
  );
};
