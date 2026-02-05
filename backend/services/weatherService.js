const axios = require("axios");

const WEATHER_API_KEY = "7bf7c0663dd1205197145ccf73148755"; // ✅ key sahi format me

async function getWeather(city = "Lucknow") {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          q: city,
          appid: WEATHER_API_KEY,
          units: "metric"
        },
        timeout: 5000
      }
    );

    return {
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      condition: response.data.weather[0].main,
      description: response.data.weather[0].description
    };

  } catch (error) {
    if (error.response) {
      // 👇 API ne error diya
      console.error(
        "❌ Weather API Error:",
        error.response.status,
        error.response.data.message
      );
    } else {
      // 👇 network / timeout
      console.error("❌ Weather API Network Error:", error.message);
    }
    return null;
  }
}

module.exports = { getWeather };
