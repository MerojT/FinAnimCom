import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Hero() {
  const navigate = useNavigate();

  const handleRandomClick = async () => {
    try {
      const res = await api.get("/anime/random");
      navigate(`/watch/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: "relative", padding: "70px 40px", background: "var(--text)", color: "var(--bg)", border: "3px solid var(--line)", overflow: "hidden", marginBottom: "50px" }}>
      <div style={{ position: "absolute", inset: 0, background: "repeating-conic-gradient(from 0deg, rgba(255,45,110,.18) 0deg 6deg, transparent 6deg 18deg)", mixBlendMode: "screen", pointerEvents: "none" }} />

      <div style={{ fontFamily: "var(--font-mono)", background: "var(--yellow)", color: "#14121A", display: "inline-block", padding: "4px 10px", fontSize: "12px", fontWeight: 700, border: "2px solid var(--line)", transform: "rotate(-2deg)", marginBottom: "22px", position: "relative" }}>
        СЕЗОН · ЛЕТО 2026
      </div>

      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px, 6vw, 66px)", lineHeight: 1.05, margin: "0 0 20px", maxWidth: "820px", textShadow: "4px 4px 0 var(--magenta)", position: "relative" }}>
        ВСЯ ВСЕЛЕННАЯ
        <br />
        АНИМЕ В ОДНОЙ ВКЛАДКЕ
      </h1>

      <p style={{ fontSize: "17px", maxWidth: "520px", opacity: 0.75, margin: "0 0 30px", position: "relative" }}>
        Тысячи серий, ежедневные обновления и ни одной пропущенной премьеры. Смотри там, где остановился — регистрация не обязательна.
      </p>

      <div style={{ position: "relative" }}>
        <button onClick={handleRandomClick} style={{ fontFamily: "var(--font-mono)", fontWeight: 700, textTransform: "uppercase", fontSize: "14px", padding: "14px 26px", border: "2px solid var(--line)", background: "var(--magenta)", color: "#fff", boxShadow: "4px 4px 0 var(--yellow)", cursor: "pointer" }}>
          ▶ Смотреть сейчас
        </button>
      </div>
    </div>
  );
}

export default Hero;