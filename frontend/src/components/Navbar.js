import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div style={nav}>
      <h2>🌾 Sugarcane AI</h2>
      <div>
        <Link to="/" style={link}>Home</Link>
        <Link to="/scan" style={link}>Scan</Link>
      </div>
    </div>
  );
}

const nav = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px 30px",
  background: "#000",
  color: "#64ffda"
};

const link = {
  marginLeft: "20px",
  color: "#fff",
  textDecoration: "none",
  fontWeight: "bold"
};
