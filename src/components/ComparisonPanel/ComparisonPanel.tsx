import React, { useEffect, useMemo } from "react";
import './ComparisonPanel.css';
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchComparisons } from "../../store/weatherSlice";
import { CITIES, normalizeCity } from "../../utils/cities";
import type { WeatherData } from "../../store/weatherSlice";

interface ComparisonResult {
  name: string;
  tempDiff: number;
  humidityDiff: number;
}

interface ComparisonPanelProps {
  current: {
    current: {
      temp_c: number;
      humidity: number;
    };
    location: {
      name: string;
    };
  };
}

const ComparisonPanel = ({ current }: ComparisonPanelProps) => {
  const dispatch = useAppDispatch();
  const comparisonsData = useAppSelector((state) => state.weather.comparisons);
  const error = useAppSelector((state) => state.weather.error);

  useEffect(() => {
    if (!current) return;

    const currentCityName = current.location.name.toLowerCase();
    const citiesToFetch = CITIES.filter(
      (city) => city.toLowerCase() !== currentCityName
    )
      .slice(0, 3)
      .map((c) => normalizeCity(c));

    if (citiesToFetch.length > 0) {
      dispatch(fetchComparisons(citiesToFetch));
    }
  }, [current?.location.name, dispatch]);

  const comparisons: ComparisonResult[] = useMemo(() => {
    if (!current) return [];
    const { temp_c, humidity } = current.current;
    return comparisonsData.map((data: WeatherData) => ({
      name: data.location.name,
      tempDiff: data.current.temp_c - temp_c,
      humidityDiff: data.current.humidity - humidity,
    }));
  }, [comparisonsData, current]);

  return (
    <div className="panel-container">
      <h3 className="panel-heading">
        Comparison with other cities:
      </h3>
      {error && <p className="panel-error">{error}</p>}
      <ul className="city-list">
        {comparisons.map((item) => (
          <li key={item.name} className="city-item">
            <span className="city-name">{item.name}</span>
            <span
              className={`city-diff ${
                item.tempDiff > 0 ? "city-warm" : "city-cold"
              }`}
            >
              {item.tempDiff > 0
                ? `warmer by ${item.tempDiff.toFixed(1)}°C`
                : `colder by ${Math.abs(item.tempDiff).toFixed(1)}°C`}
              , humidity{" "}
              {item.humidityDiff > 0
                ? `higher by ${item.humidityDiff}%`
                : `lower by ${Math.abs(item.humidityDiff)}%`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ComparisonPanel;
