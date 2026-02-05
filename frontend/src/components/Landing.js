export default function Landing() {
  return (
    <div style={page}>
      <h1>🌾 AI Sugarcane Disease Advisor</h1>
      <p style={{ maxWidth: "600px", margin: "auto" }}>
        Ye AI system sugarcane ke leaf ki photo scan karke
        disease detect karta hai aur Hinglish me ilaj aur bachav batata hai.
      </p>

      <div style={cards}>
        <Card title="📸 Image Scan" text="Leaf ki photo upload karein" />
        <Card title="🤖 AI Detection" text="AI disease identify karega" />
        <Card title="💊 Advisory" text="Ilaj aur bachav ki sahi salah" />
      </div>
    </div>
  );
}

function Card({ title, text }) {
  return (
    <div style={card}>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

const page = {
  minHeight: "100vh",
  padding: "60px",
  background: "linear-gradient(to right, #000, #111)",
  color: "#fff",
  textAlign: "center"
};

const cards = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginTop: "40px"
};

const card = {
  background: "rgba(0,0,0,0.6)",
  padding: "20px",
  borderRadius: "15px",
  border: "1px solid #64ffda"
};
