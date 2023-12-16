'use client';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudSun,
  Cloudy,
  LucideIcon,
  Snowflake,
  Sun,
  Umbrella
} from 'lucide-react';

import { Card, CardContent, CardDescription } from './ui/card';
import { round } from '@/lib/utils';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';
import { ThreeHourWeatherForecastResponse } from '@/types/threeHourWeatherForecast';
import { useDispatch } from '@/lib/hooks/useDispatch';
import { useState } from 'react';
import { CurrentWeatherResponse } from '@/types/currentWeather';

const ResponsiveContainerSharedProps = {
  width: '100%',
  height: 200
};
const LineChartSharedProps = {
  margin: { top: 0, right: 50, bottom: 0, left: 30 }
};
const CartesianGridSharedProps = {
  strokeDasharray: '3 3',
  strokeOpacity: 0.3
};
const YAxisSharedProps = {
  hide: true,
  padding: { top: 0, bottom: 5 }
};
const type = 'monotone' as const;
const LineSharedProps = {
  isAnimationActive: false,
  type,
  strokeWidth: 3
};
const position = 'top' as const;
const LabelListSharedProps = {
  fontSize: '0.75em',
  position,
  offset: 10
};

type IconIndex = '01' | '02' | '03' | '04' | '09' | '10' | '11' | '13' | '50';
type DayNight = 'd' | 'n';
type IconSymbol = `${IconIndex}${DayNight}`;
const iconMap: Record<IconSymbol, LucideIcon> = {
  '01d': Sun,
  '01n': Sun,
  '02d': CloudSun,
  '02n': CloudSun,
  '03d': Cloud,
  '03n': Cloud,
  '04d': Cloudy,
  '04n': Cloudy,
  '09d': CloudDrizzle,
  '09n': CloudDrizzle,
  '10d': Umbrella,
  '10n': Umbrella,
  '11d': CloudLightning,
  '11n': CloudLightning,
  '13d': Snowflake,
  '13n': Snowflake,
  '50d': CloudFog,
  '50n': CloudFog
};

const fetchData = async (url: string) => {
  const response = await fetch(url);
  const { data } = await response.json();
  return data;
};

const customizedGroupTick = ({
  x: _x,
  y: _y,
  payload
}: {
  x: unknown;
  y: unknown;
  payload: { value: unknown };
}) => {
  const { value: _value } = payload;
  const x = isNaN(Number(_x)) ? 0 : Number(_x) - 12;
  const y = isNaN(Number(_y)) ? 0 : Number(_y) - 6;
  const value = _value as IconSymbol;

  const Icon = iconMap[value];

  return <Icon x={x} y={y} />;
};

export type WeatherForecastProps = {
  fiveDayWeatherData: ThreeHourWeatherForecastResponse;
};
export const WeatherForecast = () => {
  const [threeHourWeatherForecastData, setThreeHourWeatherForecastData] =
    useState<ThreeHourWeatherForecastResponse | null>(null);

  useDispatch(
    () => {
      fetchData('/api/weather/threeHourWeatherForecast').then((data) => {
        console.log(data);
        setThreeHourWeatherForecastData(data);
      });
    },
    // refetch every 30 minutes
    1000 * 60 * 30
  );

  const [currentWeatherData, setCurrentWeatherData] =
    useState<CurrentWeatherResponse | null>(null);
  useDispatch(
    () => {
      fetchData('/api/weather/currentWeather').then((data) => {
        console.log(data);
        setCurrentWeatherData(data);
      });
    },
    // refetch every 30 minutes
    1000 * 60 * 30
  );

  if (!threeHourWeatherForecastData && !currentWeatherData) return <></>;
  const Icon = iconMap[currentWeatherData?.weather.at(0)?.icon as IconSymbol];

  return (
    <Card className="p-1.5 w-full">
      <div>
        {currentWeatherData && (
          <>
            <div className="flex flex-row justify-between">
              <h3>
                {round(currentWeatherData.main.temp, 1)}°C (odczuwalna{' '}
                {round(currentWeatherData.main.feels_like, 1)}°C)
              </h3>
              <CardDescription>
                Aktualizacja{' '}
                {format(new Date(currentWeatherData.dt * 1000), 'HH:mm', {
                  locale: pl
                })}
              </CardDescription>
            </div>
            <div className="flex flex-row justify-between">
              <p className="flex gap-2 self-start items-center">
                <Icon size={'1em'} className="align-middle" />
                <span>{currentWeatherData.weather.at(0)?.description}</span>
              </p>
              <div className="-mb-6">
                <p className="flex gap-2 items-center">
                  <span>
                    wschód{' '}
                    {format(
                      new Date(currentWeatherData.sys.sunrise * 1000),
                      'HH:mm',
                      { locale: pl }
                    )}
                  </span>
                  <Icon size={'1em'} className="align-middle" />
                </p>
                <p className="flex gap-2 items-center">
                  <span>
                    zachód{' '}
                    {format(
                      new Date(currentWeatherData.sys.sunset * 1000),
                      'HH:mm',
                      { locale: pl }
                    )}
                  </span>
                  <Icon size={'1em'} className="align-middle" />
                </p>
              </div>
            </div>
          </>
        )}
        {threeHourWeatherForecastData && <h4>Prognoza 48h</h4>}
      </div>
      {threeHourWeatherForecastData && (
        <>
          <CardDescription className="mt-1">Temperatura [°C]</CardDescription>
          <CardContent className="p-0 mt-1">
            <ResponsiveContainer {...ResponsiveContainerSharedProps}>
              <LineChart
                data={threeHourWeatherForecastData.list}
                {...LineChartSharedProps}>
                <CartesianGrid {...CartesianGridSharedProps} />

                <YAxis {...YAxisSharedProps} />
                <Line
                  {...LineSharedProps}
                  dataKey="main.temp"
                  stroke="hsl(var(--primary) / 75%)">
                  <LabelList
                    {...LabelListSharedProps}
                    dataKey="main.temp"
                    fill="hsl(var(--primary-foreground))"
                    formatter={(value: number) => round(value)}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <CardContent className="p-0">
            <ResponsiveContainer
              {...ResponsiveContainerSharedProps}
              height={30}>
              <LineChart
                data={threeHourWeatherForecastData.list}
                {...LineChartSharedProps}>
                <XAxis
                  dataKey={'weather.0.icon'}
                  angle={90}
                  tick={customizedGroupTick}
                  tickLine={false}
                  axisLine={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
          <CardDescription className="mt-1">
            Śnieg i deszcz [mm]
          </CardDescription>
          <CardContent className="p-0 mt-1">
            <ResponsiveContainer
              {...ResponsiveContainerSharedProps}
              height={ResponsiveContainerSharedProps.height + 110}>
              <LineChart
                data={threeHourWeatherForecastData.list.map((e) => ({
                  ...e,
                  rain: e.rain || { '3h': 0 },
                  snow: e.snow || { '3h': 0 },
                  dt: format(new Date(e.dt * 1000), 'dd HH:mm', {
                    locale: pl
                  })
                }))}
                {...LineChartSharedProps}
                margin={{ ...LineChartSharedProps.margin, bottom: 110 }}>
                <CartesianGrid {...CartesianGridSharedProps} />
                <YAxis {...YAxisSharedProps} />
                <XAxis dataKey={'dt'} angle={70} textAnchor={'start'} />
                <Line
                  {...LineSharedProps}
                  dataKey="rain.3h"
                  stroke="hsl(var(--blue-400) / 75%)">
                  <LabelList
                    {...LabelListSharedProps}
                    dataKey="rain.3h"
                    fill="hsl(var(--blue-300))"
                    formatter={(value: number) => (value === 0 ? '' : value)}
                  />
                </Line>
                <Line
                  {...LineSharedProps}
                  dataKey="snow.3h"
                  stroke="hsl(var(--gray-300) / 75%)">
                  <LabelList
                    {...LabelListSharedProps}
                    dataKey="snow.3h"
                    fill="hsl(var(--gray-200))"
                    formatter={(value: number) => (value === 0 ? '' : value)}
                  />
                </Line>
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </>
      )}
    </Card>
  );
};
