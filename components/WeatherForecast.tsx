'use client';
import { cn } from '@/lib/utils';
import { Area, AreaChart, LabelList, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: '1',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '2',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '3',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '4',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '5',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '6',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '7',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '8',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '9',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '10',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '11',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '12',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '13',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '14',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '15',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '16',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '17',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '18',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '19',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '20',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '21',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '22',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '23',
    total: Math.floor(Math.random() * 10) - 5
  },
  {
    name: '24',
    total: Math.floor(Math.random() * 10) - 5
  }
].map((e) => ({ ...e, total_deg: String(e.total) + '°C' }));

const gradientOffset = () => {
  const dataMax = Math.max(...data.map((i) => i.total));
  const dataMin = Math.min(...data.map((i) => i.total));

  if (dataMax < 0) {
    return 0;
  }
  if (dataMin >= 0) {
    return 1;
  }

  return dataMax / (dataMax - dataMin);
};

const off = gradientOffset();

export type WeatherForecastProps = React.HTMLAttributes<HTMLDivElement>;
export const WeatherForecast = ({
  className,
  ...props
}: WeatherForecastProps) => {
  return (
    <div className={cn('', className)} {...props}>
      <h2>Obecna temperatura: {data[0].total_deg}</h2>
      <h4>Prognoza 24h</h4>
      <ResponsiveContainer width={700} height={350}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset={off}
                stopColor="hsl(var(--amber-600))"
                stopOpacity={1}
              />
              <stop
                offset={off}
                stopColor="hsl(var(--blue-600))"
                stopOpacity={1}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="total"
            stroke="hsl(var(--foreground))"
            fill="url(#splitColor)">
            <LabelList dataKey="total" position="end" />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
