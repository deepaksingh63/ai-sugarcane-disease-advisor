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

    /* 1️⃣ Flask AI prediction */
    const formData = new FormData();
    formData.append("image", fs.createReadStream(req.file.path));

    const flaskRes = await axios.post(
      "http://127.0.0.1:8000/predict",
      formData,
      { headers: formData.getHeaders() }
    );

    const disease = flaskRes.data.disease;

    /* 2️⃣ Disease advisory */
    const advisoryData = advisory[disease] || {
      reason: "Is disease ki advisory abhi available nahi hai.",
      effects: [],
      treatment: [],
      prevention: []
    };

    /* 3️⃣ Weather data (TEMP city hardcoded) */
    const weather = await getWeather("Lucknow");

    /* 4️⃣ Weather + Disease rule engine */
    const weatherAdvice = weather
      ? applyWeatherRules(disease, weather)
      : [];

    /* 5️⃣ Cleanup */
    fs.unlinkSync(req.file.path);

    /* 6️⃣ FINAL RESPONSE */
    return res.json({
      crop: flaskRes.data.crop,
      disease,
      confidence: flaskRes.data.confidence,
      weather, // 🔥 THIS WAS MISSING
      explanation: {
        reason: advisoryData.reason,
        effects: advisoryData.effects,
        treatment: advisoryData.treatment,
        prevention: advisoryData.prevention,
        weather_advice: weatherAdvice // 🔥 NEW
      }
    });

  } catch (err) {
    console.error("Prediction error:", err.message);
    return res.status(500).json({ error: "Prediction failed" });
  }
});

module.exports = router;
