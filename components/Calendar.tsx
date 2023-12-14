'use client';

import './Calendar.css';
import ReactCalendar, {
  CalendarProps as ReactCalendarProps
} from 'react-calendar';

export type CalendarProps = ReactCalendarProps;
export const Calendar = ({ value, ...props }: CalendarProps) => {
  return (
    <ReactCalendar
      locale="PL-pl"
      className={'text-2xl'}
      value={value}
      {...props}
    />
  );
};
