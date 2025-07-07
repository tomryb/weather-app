import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home/Home";
import CityPage from "./pages/City";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:city" element={<CityPage />} />
    </Routes>
  );
};

export default App;
