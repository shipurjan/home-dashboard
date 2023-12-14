'use client';

import './Calendar.css';
import ReactCalendar, {
  CalendarProps as ReactCalendarProps
} from 'react-calendar';

export type CalendarProps = ReactCalendarProps;
export const Calendar = ({ value, ...props }: CalendarProps) => {
  return (
    <ReactCalendar
      next2Label={null}
      nextLabel={null}
      prev2Label={null}
      prevLabel={null}
      locale="PL-pl"
      className={'text-4xl'}
      value={value}
      showFixedNumberOfWeeks={true}
      {...props}
    />
  );
};
