import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

function colorFromUsername(username) {
  const palette = ["var(--magenta)", "var(--cyan)", "var(--violet)", "#FF8A00", "#2ECC71", "#E91E63"];
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

function Header() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [menuOpen, setMenuOpen] = useState(false);

  const linkStyle = (path) => ({
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    fontSize: "13px",
    textTransform: "uppercase",
    padding: "9px 16px",
    textDecoration: "none",
    color: location.pathname === path ? "var(--yellow)" : "var(--text)",
    background: location.pathname === path ? "var(--text)" : "transparent",
    border: "2px solid var(--line)",
  });

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--bg)", borderBottom: "3px solid var(--line)", padding: "14px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "22px", textDecoration: "none", color: "var(--text)" }}>
          Fin
          <span style={{ background: "var(--magenta)", color: "#fff", padding: "2px 8px", marginLeft: "4px", border: "2px solid var(--line)", display: "inline-block", transform: "rotate(-3deg)" }}>
            AnimCom
          </span>
        </Link>

        <nav className="header-nav-desktop">
          <Link to="/" style={linkStyle("/")}>Главная</Link>
          <Link to="/catalog" style={linkStyle("/catalog")}>Каталог</Link>
          {user?.role === "admin" && <Link to="/admin/users" style={linkStyle("/admin/users")}>Админка</Link>}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button className="header-burger" onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "2px solid var(--line)", padding: "8px 12px", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: "16px" }}>
            ☰
          </button>

          {user ? (
            <Link to="/profile" style={{ width: "34px", height: "34px", borderRadius: "50%", background: colorFromUsername(user.username), border: "2px solid var(--line)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", color: "#fff", fontSize: "13px", textDecoration: "none" }}>
              {user.username[0].toUpperCase()}
            </Link>
          ) : (
            <Link to="/profile" style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "12px", textTransform: "uppercase", padding: "9px 16px", border: "2px solid var(--line)", background: "var(--magenta)", color: "#fff", textDecoration: "none" }}>
              Войти
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px" }}>
          <Link to="/" onClick={() => setMenuOpen(false)} style={linkStyle("/")}>Главная</Link>
          <Link to="/catalog" onClick={() => setMenuOpen(false)} style={linkStyle("/catalog")}>Каталог</Link>
          {user?.role === "admin" && <Link to="/admin/users" onClick={() => setMenuOpen(false)} style={linkStyle("/admin/users")}>Админка</Link>}
        </div>
      )}
    </header>
  );
}

export default Header;