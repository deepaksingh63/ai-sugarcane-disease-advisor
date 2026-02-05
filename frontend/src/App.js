import React, { useState, useRef } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("hinglish");
  const [speaking, setSpeaking] = useState(false);
  const speechRef = useRef(null);

  /* ================= UI TEXT ================= */
  const uiText = {
    hinglish: {
      title: "🌾 AI Sugarcane Disease Advisor",
      subtitle:
        "Sugarcane leaf ki photo upload karo aur AI se disease, ilaj aur bachav jaankari pao.",
      upload: "📷 Leaf Image Upload",
      scan: "🔬 Scan Disease",
      scanning: "🔍 Scanning...",
      crop: "🌱 Crop",
      disease: "🦠 Disease",
      confidence: "📊 Confidence",
      reason: "📌 Disease kyon hoti hai?",
      effects: "⚠️ Nuksaan",
      treatment: "💊 Ilaj",
      prevention: "🛡️ Bachav",
      weather: "🌦️ Mausam ki jankari",
      spray: "🧪 Spray Salah",
      speak: "🔊 Suno",
      stop: "⏹️ Roko",
      camera: "📸 Photo lo / Upload karo"
    },
    english: {
      title: "🌾 AI Sugarcane Disease Advisor",
      subtitle:
        "Upload a sugarcane leaf image and get AI-based disease detection and advisory.",
      upload: "📷 Upload Leaf Image",
      scan: "🔬 Scan Disease",
      scanning: "🔍 Scanning...",
      crop: "🌱 Crop",
      disease: "🦠 Disease",
      confidence: "📊 Confidence",
      reason: "📌 Why does this disease occur?",
      effects: "⚠️ Effects",
      treatment: "💊 Treatment",
      prevention: "🛡️ Prevention",
      weather: "🌦️ Weather Information",
      spray: "🧪 Spray Advice",
      speak: "🔊 Listen",
      stop: "⏹️ Stop",
      camera: "📸 Capture / Upload Photo"
    }
  };

  /* ================= SPRAY DECISION ================= */
  const getSprayDecision = (weather) => {
    if (!weather) return "";

    const { temperature, humidity, condition } = weather;

    if (condition.toLowerCase().includes("rain")) {
      return lang === "english"
        ? "Do not spray during rain."
        : "Barish ke dauran spray na karein.";
    }

    if (temperature > 35) {
      return lang === "english"
        ? "Too hot. Spraying may burn leaves."
        : "Zyada garmi hai, spray se patte jal sakte hain.";
    }

    if (temperature < 18) {
      return lang === "english"
        ? "Too cold. Spray effectiveness will be low."
        : "Thanda mausam hai, spray ka asar kam hoga.";
    }

    if (humidity > 80) {
      return lang === "english"
        ? "High humidity. Spray in morning or evening."
        : "Zyada nami hai, subah ya shaam spray karein.";
    }

    return lang === "english"
      ? "Weather is suitable for spraying."
      : "Mausam spray ke liye theek hai, aap spray kar sakte hain.";
  };

  /* ================= HANDLERS ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please select an image");

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/api/predict",
        formData
      );
      setResult(res.data);
    } catch {
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= VOICE ================= */
  const speak = () => {
    if (!result) return;

    const sprayAdvice = result.weather
      ? getSprayDecision(result.weather)
      : "";

    const text = `
      Crop is ${result.crop}.
      Disease is ${result.disease}.
      Confidence is ${result.confidence} percent.
      Reason: ${result.explanation.reason}.
      Effects are: ${result.explanation.effects.join(", ")}.
      Treatment: ${result.explanation.treatment.join(", ")}.
      Prevention: ${result.explanation.prevention.join(", ")}.
      ${
        result.weather
          ? `Weather is ${result.weather.temperature} degree Celsius with ${result.weather.condition}.`
          : ""
      }
      ${sprayAdvice ? `Spray advice: ${sprayAdvice}` : ""}
    `;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === "english" ? "en-IN" : "hi-IN";

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const stopSpeak = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div style={page}>
      {/* Language Switch */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button
          onClick={() =>
            setLang(lang === "hinglish" ? "english" : "hinglish")
          }
          style={langBtn}
        >
          {lang === "hinglish" ? "English" : "Hinglish"}
        </button>
      </div>

      {/* HERO */}
      <div style={hero}>
        <h1 style={heroTitle}>{uiText[lang].title}</h1>
        <p style={heroText}>{uiText[lang].subtitle}</p>
      </div>

      {/* UPLOAD (CAMERA + GALLERY) */}
      <div style={uploadCard}>
        <h3>{uiText[lang].upload}</h3>

        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{ width: "100%", borderRadius: "12px" }}
          />
        )}

        <label style={cameraBtn}>
          {uiText[lang].camera}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageChange}
            style={{ display: "none" }}
          />
        </label>

        <br /><br />

        <button style={scanBtn} onClick={handleSubmit}>
          {loading ? uiText[lang].scanning : uiText[lang].scan}
        </button>
      </div>

      {/* RESULT */}
      {result && (
        <div style={resultGrid}>
          <div style={card}>
            <h3>{uiText[lang].crop}</h3>
            <p>{result.crop}</p>
            <h3>{uiText[lang].disease}</h3>
            <p>{result.disease}</p>
            <h3>{uiText[lang].confidence}</h3>
            <p>{result.confidence}%</p>

            {!speaking ? (
              <button style={voiceBtn} onClick={speak}>
                {uiText[lang].speak}
              </button>
            ) : (
              <button style={stopBtn} onClick={stopSpeak}>
                {uiText[lang].stop}
              </button>
            )}
          </div>

          {result.weather && (
            <div style={card}>
              <h3>{uiText[lang].weather}</h3>
              <p>🌡️ {result.weather.temperature} °C</p>
              <p>💧 {result.weather.humidity}%</p>
              <p>☁️ {result.weather.condition}</p>
              <hr />
              <b>{uiText[lang].spray}</b>
              <p>{getSprayDecision(result.weather)}</p>
            </div>
          )}

          <InfoCard title={uiText[lang].reason} content={result.explanation.reason} />
          <ListCard title={uiText[lang].effects} items={result.explanation.effects} />
          <ListCard title={uiText[lang].treatment} items={result.explanation.treatment} />
          <ListCard title={uiText[lang].prevention} items={result.explanation.prevention} />
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */
const InfoCard = ({ title, content }) => (
  <div style={card}>
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);

const ListCard = ({ title, items }) => (
  <div style={card}>
    <h3>{title}</h3>
    <ul>
      {items.map((i, idx) => (
        <li key={idx}>{i}</li>
      ))}
    </ul>
  </div>
);

/* ================= STYLES ================= */
const page = {
  minHeight: "100vh",
  background:
    "linear-gradient(rgba(0,0,0,0.75),rgba(0,0,0,0.75)), url('/bg.jpg') center/cover",
  color: "#fff",
  padding: "30px",
  fontFamily: "Arial",
  position: "relative"
};

const hero = { textAlign: "center", marginBottom: "40px" };
const heroTitle = { fontSize: "36px", color: "#64ffda" };
const heroText = { maxWidth: "700px", margin: "10px auto", color: "#ddd" };

const uploadCard = {
  maxWidth: "360px",
  margin: "0 auto",
  background: "rgba(0,0,0,0.6)",
  padding: "22px",
  borderRadius: "18px",
  textAlign: "center",
  border: "2px dashed #64ffda"
};

const cameraBtn = {
  display: "inline-block",
  background: "#64ffda",
  color: "#000",
  padding: "12px 18px",
  borderRadius: "12px",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px"
};

const scanBtn = {
  background: "#64ffda",
  color: "#000",
  padding: "10px 20px",
  borderRadius: "10px",
  border: "none",
  fontWeight: "bold",
  cursor: "pointer"
};

const resultGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
  gap: "16px",
  marginTop: "40px",
  maxWidth: "900px",
  margin: "40px auto"
};

const card = {
  background: "rgba(0,0,0,0.6)",
  padding: "18px",
  borderRadius: "14px"
};

const langBtn = {
  background: "#64ffda",
  border: "none",
  padding: "8px 14px",
  borderRadius: "20px",
  fontWeight: "bold",
  cursor: "pointer"
};

const voiceBtn = {
  marginTop: "10px",
  background: "#00e676",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer"
};

const stopBtn = {
  marginTop: "10px",
  background: "#ff5252",
  border: "none",
  padding: "8px",
  borderRadius: "8px",
  cursor: "pointer"
};

export default App;
