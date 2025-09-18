import "dotenv/config";
import express from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Provider } from "react-redux";
import { createStore } from "../store/store";
import { fetchWeather } from "../store/weatherSlice";
import App from "../App";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.resolve(__dirname, '../dist/public')));

// Proxy endpoint to avoid CORS and keep API key server-side
app.get("/api/weather", async (req, res) => {
  const city = (req.query.city as string) || "";
  const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || "";
  if (!API_KEY) {
    return res.status(500).json({ error: "Missing API key" });
  }
  if (!city) {
    return res.status(400).json({ error: "Missing city query param" });
  }
  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${encodeURIComponent(city)}&lang=pl`;
    const response = await axios.get(url);
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.json(response.data);
  } catch (e: any) {
    return res.status(502).json({ error: "Upstream error", detail: e?.message });
  }
});

app.get("*", async (req, res) => {
  const store = createStore();

  const matchCity = req.url.match(/^\/(.+)$/);
  const city = matchCity && matchCity[1] ? decodeURIComponent(matchCity[1]) : null;

  if (city) {
    try {
      await store.dispatch(fetchWeather(city));
    } catch (e) {
      // swallow to render anyway
    }
  }

  const appHtml = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url}>
        <App />
      </StaticRouter>
    </Provider>
  );

  const preloadedState = store.getState();

  const indexFile = path.resolve("public/index.html");
  fs.readFile(indexFile, "utf8", (err, data) => {
    if (err) {
      console.error("Read error:", err);
      return res.status(500).send("Internal server error");
    }

    const withApp = data.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>\n<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, "\\u003c")};</script>`
    );

    return res.send(withApp);
  });
});

app.listen(PORT, () => {
  console.log(`SSR server running on http://localhost:${PORT}`);
});
