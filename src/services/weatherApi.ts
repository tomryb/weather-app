import axios from "axios";

const API_BASE_URL = "https://api.weatherapi.com/v1";
const PROXY_BASE = "/api/weather";

const API_KEY =
  (typeof process !== "undefined" && process.env && (process.env as any).REACT_APP_OPENWEATHER_API_KEY) ||
  (typeof window !== "undefined" && (window as any).REACT_APP_OPENWEATHER_API_KEY) ||
  "";

export interface WeatherResponse {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    humidity: number;
    wind_kph: number;
  };
}

export async function fetchCurrentWeather(cityQuery: string): Promise<WeatherResponse> {
  if (typeof window === "undefined") {
    const url = `${API_BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(cityQuery)}&lang=pl`;
    const response = await axios.get(url);
    return response.data as WeatherResponse;
  }
  const response = await axios.get(`${PROXY_BASE}?city=${encodeURIComponent(cityQuery)}`);
  return response.data as WeatherResponse;
}

export async function fetchManyCurrentWeather(cities: string[]): Promise<WeatherResponse[]> {
  const responses = await Promise.all(cities.map((c) => fetchCurrentWeather(c)));
  return responses;
}


