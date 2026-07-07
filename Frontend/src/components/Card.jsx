import { Link } from "react-router-dom";

function Card({ anime }) {
  return (
    <Link to={`/watch/${anime.id}`} style={{ display: "block", background: "var(--surface)", border: "3px solid var(--line)", boxShadow: "5px 5px 0 var(--line)", textDecoration: "none", color: "var(--text)" }}>
      <div style={{ position: "relative", height: "280px", overflow: "hidden" }}>
        <img src={anime.posterUrl} alt={anime.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.85), transparent 55%)" }} />

        {anime.ageRestricted && (
          <span style={{ position: "absolute", top: "10px", left: "10px", background: "#14121A", color: "var(--magenta)", border: "2px solid var(--magenta)", fontFamily: "var(--font-mono)", fontSize: "10px", fontWeight: 700, padding: "3px 7px" }}>
            18+
          </span>
        )}

        <span style={{ position: "absolute", top: "10px", right: "10px", background: "#14121A", color: "var(--yellow)", fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, padding: "3px 7px" }}>
          ★ {anime.rating}
        </span>

        <p style={{ position: "absolute", bottom: "10px", left: "10px", right: "10px", margin: 0, fontFamily: "var(--font-display)", fontSize: "14px", lineHeight: 1.2, color: "#fff", textShadow: "2px 2px 0 rgba(0,0,0,.4)" }}>
          {anime.title}
        </p>
      </div>

      <div style={{ padding: "8px 10px", borderTop: "3px solid var(--line)", display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: "11px" }}>
        <span style={{ color: "var(--muted)" }}>{anime.genre}</span>
        <span style={{ fontWeight: 700 }}>{anime.episodes || "—"} эп.</span>
      </div>
    </Link>
  );
}

export default Card;