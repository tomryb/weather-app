import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCurrentWeather, fetchManyCurrentWeather, WeatherResponse } from "../services/weatherApi";

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
      const response: WeatherResponse = await fetchCurrentWeather(city);
      return response as WeatherData;
    } catch (err) {
      return rejectWithValue("Nie udało się pobrać danych pogodowych.");
    }
  }
);

export const fetchComparisons = createAsyncThunk<WeatherData[], string[]>(
  "weather/compare",
  async (cities: string[]) => {
    const responses = await fetchManyCurrentWeather(cities);
    return responses as WeatherData[];
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
