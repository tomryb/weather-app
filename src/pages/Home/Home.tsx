import React from "react";
import "./Home.css";
import SearchForm from "../../components/SearchForm/SearchForm";

const HomePage = () => (
  <div className="home-container">
    <h1 className="home-title">Check the Weather</h1>
    <p className="home-description">
      Enter the name of a city to check the current weather and compare it with
      other cities in Poland.
    </p>
    <SearchForm />
  </div>
);

export default HomePage;
