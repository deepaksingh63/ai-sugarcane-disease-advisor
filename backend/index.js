const express = require("express");
const cors = require("cors");

const predictRoute = require("./routes/predict"); // 🔥 ROUTE IMPORT
const { getWeather } = require("./services/weatherService"); // 🔥 WEATHER SERVICE

const app = express();

app.use(cors());
app.use(express.json());

/* 🔥 VERY IMPORTANT */
app.use("/api", predictRoute);

/* =========================
   🔧 TEMP WEATHER API TEST
   (sirf STEP 1 verification)
========================= */
getWeather("Lucknow").then((data) => {
  console.log("🌦️ Weather API Test Result:", data);
});

/* ========================= */

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
