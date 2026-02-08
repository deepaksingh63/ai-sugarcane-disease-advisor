const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");

const advisory = require("../advisory");
const { getWeather } = require("../services/weatherService");
const { applyWeatherRules } = require("../services/ruleEngine");

const router = express.Router();

/* ======================
   ENV VARIABLES
====================== */
const ML_API_URL = process.env.ML_API_URL;
const ML_API_KEY = process.env.ML_API_KEY;

/* ======================
   MULTER CONFIG
====================== */
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const upload = multer({ dest: uploadDir });

/* ======================
   PREDICT ROUTE
====================== */
router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image not received" });
    }

    /* 1️⃣ Prepare image for ML API */
    const formData = new FormData();
    formData.append("image", fs.createReadStream(req.file.path));

    /* 2️⃣ Call FLASK ML API (Railway) */
    const flaskRes = await axios.post(
      `${ML_API_URL}/predict`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": ML_API_KEY
        },
        timeout: 30000
      }
    );

    const { crop, disease, confidence } = flaskRes.data;

    /* ❌ NEW: Reject wrong / unclear image */
    if (confidence < 75) {
      fs.unlinkSync(req.file.path);

      return res.status(400).json({
        error: "Wrong crop image. Please upload a clear sugarcane leaf image."
      });
    }

    /* 3️⃣ Disease advisory */
    const advisoryData = advisory[disease] || {
      reason: "Is disease ki advisory abhi available nahi hai.",
      effects: [],
      treatment: [],
      prevention: []
    };

    /* 4️⃣ Weather data */
    const weather = await getWeather("Lucknow");

    /* 5️⃣ Weather + Disease rule engine */
    const weatherAdvice = weather
      ? applyWeatherRules(disease, weather)
      : [];

    /* 6️⃣ Cleanup uploaded file */
    fs.unlinkSync(req.file.path);

    /* 7️⃣ FINAL RESPONSE */
    return res.json({
      crop,
      disease,
      confidence,
      weather,
      explanation: {
        reason: advisoryData.reason,
        effects: advisoryData.effects,
        treatment: advisoryData.treatment,
        prevention: advisoryData.prevention,
        weather_advice: weatherAdvice
      }
    });

  } catch (err) {
    console.error("Prediction error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;
