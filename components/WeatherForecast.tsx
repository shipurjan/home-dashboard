'use client';
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ReferenceLine,
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
  Sunrise,
  Sunset,
  Umbrella,
  Waves,
  Wind
} from 'lucide-react';

import { Card, CardContent, CardDescription } from './ui/card';
import { round } from '@/lib/utils';
import { format } from 'date-fns';
import pl from 'date-fns/locale/pl';
import { useDispatch } from '@/lib/hooks/useDispatch';
import { useState } from 'react';
import {
  ThreeHourWeatherForecastEntry,
  ThreeHourWeatherForecastResponse
} from '@/app/api/weather/threeHourWeatherForecast/route';
import { CurrentWeatherResponse } from '@/app/api/weather/currentWeather/route';

const ResponsiveContainerSharedProps = {
  width: '100%',
  height: 175
};
const LineChartSharedProps = {
  margin: { top: 0, right: 50, bottom: 0, left: 30 }
};
const CartesianGridSharedProps = {
  strokeDasharray: '3 3',
  strokeOpacity: 0.3,
  horizontal: false,
  fill: 'hsl(var(--zinc-900) / 60%)'
};
const YAxisSharedProps = {
  hide: true,
  padding: { top: 32, bottom: 0 }
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
        setThreeHourWeatherForecastData(data);
      });
    },
    // refetch every 5 minutes
    1000 * 60 * 5
  );

  const [currentWeatherData, setCurrentWeatherData] =
    useState<CurrentWeatherResponse | null>(null);
  useDispatch(
    () => {
      fetchData('/api/weather/currentWeather').then((data) => {
        setCurrentWeatherData(data);
      });
    },
    // refetch every 5 minutes
    1000 * 60 * 5
  );

  const getLastUniqueIndices = (arr: string[]): number[] => {
    const uniqueIndices: number[] = [];
    const lastIndexMap: { [key: string]: number } = {};

    for (let i = 0; i < arr.length; i++) {
      lastIndexMap[arr[i]] = i;
    }

    for (let i = 0; i < arr.length; i++) {
      if (lastIndexMap[arr[i]] === i) {
        uniqueIndices.push(i);
      }
    }

    return uniqueIndices;
  };

  const fiveDayWeatherDataDayBreakpoints = getLastUniqueIndices(
    threeHourWeatherForecastData?.list.map((e) =>
      format(new Date(e.dt * 1000), 'dd', {
        locale: pl
      })
    ) ?? []
  );

  if (!threeHourWeatherForecastData || !currentWeatherData) return <></>;

  const CurrentWeatherIcon =
    iconMap[currentWeatherData?.weather.at(0)?.icon as IconSymbol];

  const todayLabelX =
    50 *
    (fiveDayWeatherDataDayBreakpoints[0] /
      (threeHourWeatherForecastData.list.length - 1));

  const tomorrowLabelX =
    50 *
    ((fiveDayWeatherDataDayBreakpoints[0] +
      fiveDayWeatherDataDayBreakpoints[1]) /
      (threeHourWeatherForecastData.list.length - 1));

  const overmorrowLabelX =
    50 *
    ((fiveDayWeatherDataDayBreakpoints[1] +
      fiveDayWeatherDataDayBreakpoints[2]) /
      (threeHourWeatherForecastData.list.length - 1));

  const todayFirstDay = threeHourWeatherForecastData.list.at(0);

  const tomorrowFirstDay = threeHourWeatherForecastData.list.at(
    fiveDayWeatherDataDayBreakpoints[0] + 1
  );

  const overmorrowFirstDay = threeHourWeatherForecastData.list.at(
    fiveDayWeatherDataDayBreakpoints[1] + 1
  );

  const dateDifference = (
    dateEntry: ThreeHourWeatherForecastEntry | undefined
  ) => {
    const today = Number(
      format(new Date(), 'dd', {
        locale: pl
      })
    );
    const entryDay = Number(
      format((dateEntry?.dt ?? 0) * 1000, 'dd', {
        locale: pl
      })
    );

    return entryDay - today;
  };

  const visibility = currentWeatherData.visibility;
  const currentWeather = round(currentWeatherData.main.temp);
  const feelsLike = round(currentWeatherData.main.feels_like);

  return (
    <Card className="p-1.5 w-full">
      <div>
        {currentWeatherData && (
          <>
            <div className="flex flex-row justify-between">
              <div className="flex flex-row justify-center items-center gap-2">
                <h3>
                  Teraz {currentWeather.toString().replaceAll('.', ',')}
                  °C{' '}
                </h3>
                {currentWeather !== feelsLike && (
                  <h5>
                    odczuwalna {feelsLike.toString().replaceAll('.', ',')}
                    °C
                  </h5>
                )}
              </div>
              <CardDescription className=" opacity-30">
                Ostatnia aktualizacja o{' '}
                {format(new Date(currentWeatherData.dt * 1000), 'HH:mm', {
                  locale: pl
                })}
              </CardDescription>
            </div>
            <div className="flex flex-row justify-between text-sm mb-1.5 [&>div>p]:leading-tight">
              <div className="flex flex-col">
                <p className="flex gap-2 self-start items-center">
                  <CurrentWeatherIcon size={'1em'} className="align-middle" />
                  <span>{currentWeatherData.weather.at(0)?.description}</span>
                </p>
                <p className="flex gap-2 self-start items-center">
                  <Wind size={'1em'} className="align-middle" />
                  <span>
                    prędkość wiatru{' '}
                    {round(currentWeatherData.wind.speed, 1)
                      .toString()
                      .replaceAll('.', ',')}{' '}
                    m/s
                  </span>
                </p>
                <p className="flex gap-2 self-start items-center">
                  <Waves size={'1em'} className="align-middle" />
                  <span>
                    widoczność{' '}
                    {(visibility > 549
                      ? round(visibility / 1000, 1)
                      : round(visibility)
                    )
                      .toString()
                      .replaceAll('.', ',')}{' '}
                    {visibility > 549 ? 'km' : 'm'}
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-end">
                <p className="flex gap-2 items-center">
                  <span>
                    wschód{' '}
                    {format(
                      new Date(currentWeatherData.sys.sunrise * 1000),
                      'HH:mm',
                      { locale: pl }
                    )}
                  </span>
                  <Sunrise size={'1em'} className="align-middle" />
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
                  <Sunset size={'1em'} className="align-middle" />
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
                data={threeHourWeatherForecastData.list.map((e) => ({
                  ...e,
                  dt: format(new Date(e.dt * 1000), 'H', {
                    locale: pl
                  })
                }))}
                {...LineChartSharedProps}>
                <text
                  x={`${todayLabelX}%`}
                  y="23%"
                  style={{
                    fontSize: 48,
                    fontWeight: 'bold',
                    fill: 'hsl(var(--foreground))',
                    opacity: 0.3
                  }}
                  textAnchor="start">
                  {dateDifference(todayFirstDay) === 0
                    ? fiveDayWeatherDataDayBreakpoints[1] > 9
                      ? 'dzisiaj'
                      : ''
                    : dateDifference(todayFirstDay) === 1
                      ? 'jutro'
                      : format(new Date((todayFirstDay?.dt ?? 0) * 1000), 'dd')}
                </text>
                <text
                  x={`${tomorrowLabelX}%`}
                  y="23%"
                  style={{
                    fontSize: 48,
                    fontWeight: 'bold',
                    fill: 'hsl(var(--foreground))',
                    opacity: 0.3
                  }}
                  textAnchor="start">
                  {dateDifference(tomorrowFirstDay) === 1
                    ? 'jutro'
                    : dateDifference(tomorrowFirstDay) === 2
                      ? 'pojutrze'
                      : format(
                          new Date((tomorrowFirstDay?.dt ?? 0) * 1000),
                          'dd'
                        )}
                </text>
                <text
                  x={`${overmorrowLabelX}%`}
                  y="23%"
                  style={{
                    fontSize: 48,
                    fontWeight: 'bold',
                    fill: 'hsl(var(--foreground))',
                    opacity: 0.3
                  }}
                  textAnchor="start">
                  {dateDifference(overmorrowFirstDay) === 2
                    ? 'pojutrze'
                    : dateDifference(overmorrowFirstDay) === 3
                      ? 'za 3 dni'
                      : format(
                          new Date((overmorrowFirstDay?.dt ?? 0) * 1000),
                          'dd'
                        )}
                </text>

                <CartesianGrid {...CartesianGridSharedProps} />

                <ReferenceLine
                  x={fiveDayWeatherDataDayBreakpoints[0] + 1}
                  stroke="white"
                  strokeWidth={2}
                  opacity={0.2}
                />
                <ReferenceLine
                  x={fiveDayWeatherDataDayBreakpoints[1] + 1}
                  stroke="white"
                  strokeWidth={2}
                  opacity={0.2}
                />

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
            <ResponsiveContainer {...ResponsiveContainerSharedProps}>
              <LineChart
                data={threeHourWeatherForecastData.list.map((e) => ({
                  ...e,
                  rain: e.rain || { '3h': 0 },
                  snow: e.snow || { '3h': 0 },
                  dt: format(new Date(e.dt * 1000 - 3600), 'H', {
                    locale: pl
                  })
                }))}
                {...LineChartSharedProps}
                margin={{ ...LineChartSharedProps.margin, bottom: 3 }}>
                <CartesianGrid {...CartesianGridSharedProps} />

                <ReferenceLine
                  x={fiveDayWeatherDataDayBreakpoints[0] + 1}
                  xAxisId={'id'}
                  stroke="white"
                  strokeWidth={2}
                  opacity={0.2}
                />
                <ReferenceLine
                  x={fiveDayWeatherDataDayBreakpoints[1] + 1}
                  xAxisId={'id'}
                  stroke="white"
                  strokeWidth={2}
                  opacity={0.2}
                />

                <YAxis {...YAxisSharedProps} />
                <XAxis
                  style={{
                    fill: 'white',
                    opacity: 0.68
                  }}
                  xAxisId={'date'}
                  id={'0'}
                  dataKey={'dt'}
                  angle={0}
                  textAnchor={'middle'}
                />
                <XAxis xAxisId={'id'} hide />
                <Line
                  {...LineSharedProps}
                  xAxisId={'date'}
                  dataKey="rain.3h"
                  stroke="hsl(var(--blue-400) / 75%)">
                  <LabelList
                    {...LabelListSharedProps}
                    dataKey="rain.3h"
                    fill="hsl(var(--blue-300))"
                    formatter={(value: number) =>
                      (value === 0 ? '' : round(value, 1))
                        .toString()
                        .replaceAll('.', ',')
                    }
                  />
                </Line>
                <Line
                  {...LineSharedProps}
                  xAxisId={'date'}
                  dataKey="snow.3h"
                  stroke="hsl(var(--gray-300) / 75%)">
                  <LabelList
                    {...LabelListSharedProps}
                    dataKey="snow.3h"
                    fill="hsl(var(--gray-200))"
                    formatter={(value: number) =>
                      (value === 0 ? '' : round(value, 1))
                        .toString()
                        .replaceAll('.', ',')
                    }
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
