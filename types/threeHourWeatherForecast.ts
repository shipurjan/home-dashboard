export type CityCoordWeatherForecast = {
  lat: number;
  lon: number;
};

export type CityWeatherForecast = {
  id: number;
  name: string;
  coord: CityCoordWeatherForecast;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
};

export type ThreeHourWeatherForecastEntry = {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain: {
    '3h': number;
  };
  snow: {
    '3h': number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
};

export type ThreeHourWeatherForecastResponse = {
  cod: string;
  message: number;
  cnt: number;
  list: ThreeHourWeatherForecastEntry[];
  city: CityWeatherForecast;
};
