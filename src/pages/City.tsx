import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchWeather } from "../store/weatherSlice";
import SearchForm from "../components/SearchForm/SearchForm";
import WeatherView from "../components/WeatherView/WeatherView";
import ComparisonPanel from "../components/ComparisonPanel/ComparisonPanel";
import { useAppDispatch, useAppSelector } from "../store/store";

const CityPage = () => {
  const { city } = useParams();
  const dispatch = useAppDispatch();
  const weather = useAppSelector((state) => state.weather.current);

  useEffect(() => {
    if (city) dispatch(fetchWeather(city));
  }, [city]);

  return (
    <div className="container">
      <SearchForm />
      {weather && <WeatherView data={weather} />}
      {weather && <ComparisonPanel current={weather} />}
    </div>
  );
};

export default CityPage;
