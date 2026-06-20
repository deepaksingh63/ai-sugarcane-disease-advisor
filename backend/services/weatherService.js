const axios = require("axios");

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

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
    console.log("Weather skipped");

    return {
      temperature: "N/A",
      humidity: "N/A",
      condition: "Unavailable",
      description: "Unavailable"
    };
  }
}

module.exports = { getWeather };
