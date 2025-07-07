import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "91dd1bafc5cb40aaa80131548250707";

export interface WeatherData {
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

export interface WeatherState {
  current: WeatherData | null;
  comparisons: WeatherData[];
  loading: boolean;
  error: string | null;
}

export const fetchWeather = createAsyncThunk<WeatherData, string>(
  "weather/fetch",
  async (city: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&lang=pl`
      );
      return response.data as WeatherData;
    } catch (err) {
      return rejectWithValue("Nie udało się pobrać danych pogodowych.");
    }
  }
);

export const fetchComparisons = createAsyncThunk<WeatherData[], string[]>(
  "weather/compare",
  async (cities: string[]) => {
    const responses = await Promise.all(
      cities.map((city) =>
        axios.get(
          `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&lang=pl`
        )
      )
    );
    return responses.map((res) => res.data as WeatherData);
  }
);

const initialState: WeatherState = {
  current: null,
  comparisons: [],
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchComparisons.fulfilled, (state, action) => {
        state.comparisons = action.payload;
      });
  },
});

export default weatherSlice.reducer;
