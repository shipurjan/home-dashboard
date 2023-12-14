'use client';

import './Calendar.css';
import ReactCalendar, {
  CalendarProps as ReactCalendarProps
} from 'react-calendar';

export type CalendarProps = ReactCalendarProps;
export const Calendar = ({ value }: CalendarProps) => {
  return <ReactCalendar locale="pl-PL" value={value} />;
};
