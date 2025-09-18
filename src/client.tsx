import React from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App";
import { createStore } from "./store/store";

declare global {
  interface Window { __PRELOADED_STATE__?: any; REACT_APP_OPENWEATHER_API_KEY?: string }
}

const preloaded = window.__PRELOADED_STATE__ || undefined;
const store = createStore(preloaded);

hydrateRoot(
  document.getElementById("root")!,
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
