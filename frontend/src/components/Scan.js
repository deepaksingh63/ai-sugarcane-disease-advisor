import React, { useState } from "react";
import axios from "axios";

export default function Scan() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  const scan = async () => {
    if (!image) return alert("Image select karo");

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    const res = await axios.post(
      "http://localhost:5000/api/predict",
      formData
    );
    setResult(res.data);
    setLoading(false);
  };

  return (
    <div style={page}>
      <h2>📸 Sugarcane Leaf Scan</h2>

      <div style={uploadBox}>
        <input type="file" onChange={handleImage} />
        {preview && <img src={preview} alt="" style={img} />}
        <button onClick={scan} style={btn}>
          {loading ? "Scanning..." : "Scan"}
        </button>
      </div>

      {result && (
        <div style={resultBox}>
          <h3>🦠 {result.disease}</h3>
          <p><b>Confidence:</b> {result.confidence}%</p>

          <h4>📌 Reason</h4>
          <p>{result.explanation.reason}</p>

          <h4>⚠️ Nuksaan</h4>
          <ul>
            {result.explanation.effects.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>

          <h4>💊 Ilaj</h4>
          <ul>
            {result.explanation.treatment.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>

          <h4>🛡️ Bachav</h4>
          <ul>
            {result.explanation.prevention.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

const page = {
  minHeight: "100vh",
  padding: "40px",
  background: "#000",
  color: "#fff"
};

const uploadBox = {
  background: "rgba(0,0,0,0.6)",
  padding: "20px",
  borderRadius: "15px",
  maxWidth: "400px"
};

const img = {
  width: "100%",
  marginTop: "10px",
  borderRadius: "10px"
};

const btn = {
  marginTop: "10px",
  background: "#64ffda",
  border: "none",
  padding: "10px",
  borderRadius: "10px",
  fontWeight: "bold"
};

const resultBox = {
  marginTop: "30px",
  background: "rgba(0,0,0,0.6)",
  padding: "20px",
  borderRadius: "15px"
};
