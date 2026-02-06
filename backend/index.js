const express = require("express");
const cors = require("cors");

const predictRoute = require("./routes/predict");
const { getWeather } = require("./services/weatherService");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", predictRoute);

/* ❌ Ye weather test production me hata dete hain */
// getWeather("Lucknow").then((data) => {
//   console.log("🌦️ Weather API Test Result:", data);
// });

/* ✅ RENDER FIX */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
