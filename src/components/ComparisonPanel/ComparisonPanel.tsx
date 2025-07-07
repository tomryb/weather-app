import React, { useEffect, useState } from "react";
import axios from "axios";
import './ComparisonPanel.css';

const CITIES = ["Warszawa", "Kraków", "Wrocław"];
const API_KEY = "91dd1bafc5cb40aaa80131548250707";

const normalizeCity = (city: string) =>
  city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/Ł/g, "L");

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
  const [comparisons, setComparisons] = useState<ComparisonResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!current) return;

    const { temp_c, humidity } = current.current;
    const currentCityName = current.location.name.toLowerCase();

    const fetchComparisonData = async () => {
      try {
        const citiesToFetch = CITIES.filter(
          (city) => city.toLowerCase() !== currentCityName
        ).slice(0, 3);

        const responses = await Promise.all(
          citiesToFetch.map(async (city) => {
            const res = await axios.get(
              `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(
                normalizeCity(city)
              )}&lang=en`
            );

            return {
              name: city,
              tempDiff: res.data.current.temp_c - temp_c,
              humidityDiff: res.data.current.humidity - humidity,
            };
          })
        );

        setComparisons(responses);
        setError(null);
      } catch (err) {
        console.error("❌ Error fetching comparison data:", err);
        setError("Failed to fetch comparison data.");
      }
    };

    fetchComparisonData();
  }, [current]);

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
