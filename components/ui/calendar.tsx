'use client';

import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { pl } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <Card>
      <CardContent>
        <DayPicker
          locale={pl}
          showOutsideDays={showOutsideDays}
          className={cn('', className)}
          classNames={{
            months:
              'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
            month: 'space-y-4',
            nav: 'space-x-1 flex items-center',
            nav_button: cn(
              buttonVariants({ variant: 'outline' }),
              'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
            ),
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell:
              'text-muted-foreground rounded-md w-9 font-medium text-sm',
            row: 'flex w-full mt-2',
            cell: 'h-18 w-18 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: cn(
              buttonVariants({ variant: 'ghost' }),
              'h-18 w-9 p-0 font-normal aria-selected:opacity-100'
            ),
            day_range_end: 'day-range-end',
            day_selected:
              'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
            day_today: 'bg-accent text-accent-foreground',
            day_outside:
              'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle:
              'aria-selected:bg-accent aria-selected:text-accent-foreground',
            day_hidden: 'invisible',
            ...classNames
          }}
          components={{
            Caption: (props) => {
              console.log(props);
              return (
                <h3 className="text-center">
                  {format(props.displayMonth, 'LLLL yyy', { locale: pl })}
                </h3>
              );
            }
          }}
          {...props}
        />
      </CardContent>
    </Card>
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
