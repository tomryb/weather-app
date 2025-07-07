import React from "react";
import "./WeatherView.css";

const WeatherView = ({ data }: { data: any }) => {
  if (!data) return null;

  return (
    <section className="weather-container">
      <h2 className="weather-title">Weather: {data.location.name}</h2>
      <ul className="weather-list">
        <li>
          🌡️ Temperature:{" "}
          <span className="weather-value">{data.current.temp_c}°C</span>
        </li>
        <li>
          💧 Humidity:{" "}
          <span className="weather-value">{data.current.humidity}%</span>
        </li>
        <li>
          💨 Wind:{" "}
          <span className="weather-value">{data.current.wind_kph} km/h</span>
        </li>
      </ul>
    </section>
  );
};

export default WeatherView;
