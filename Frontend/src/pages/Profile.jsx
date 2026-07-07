import { useState, useEffect } from "react";
import api from "../api/axios";
import Card from "../components/Card";

function Profile() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", age: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  useEffect(() => {
    if (user) {
      api.get("/favorites").then((res) => setFavorites(res.data)).catch(console.error);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = mode === "login" ? "/auth/login" : "/auth/register";
    const payload = mode === "login" ? { email: form.email, password: form.password } : form;

    try {
      const res = await api.post(url, payload);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const inputStyle = { padding: "12px", border: "2px solid var(--line)", fontFamily: "var(--font-body)", fontSize: "14px", background: "var(--surface)", color: "var(--text)" };

  if (user) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 28px" }}>
        <div style={{ display: "flex", gap: "26px", alignItems: "center", background: "var(--text)", color: "var(--bg)", border: "3px solid var(--line)", boxShadow: "6px 6px 0 var(--line)", padding: "30px", flexWrap: "wrap" }}>
          <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "var(--magenta)", border: "3px solid var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "32px", color: "#fff", flex: "0 0 auto" }}>
            {user.username?.[0]?.toUpperCase()}
          </div>

          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", margin: "0 0 6px" }}>{user.username}</h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "12px", opacity: 0.65, margin: 0 }}>{user.email}</p>

            <div style={{ display: "flex", gap: "26px", marginTop: "16px", flexWrap: "wrap" }}>
              <div style={{ fontFamily: "var(--font-mono)" }}>
                <b style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--yellow)" }}>{user.age || "—"}</b>
                <span style={{ fontSize: "11px", opacity: 0.65 }}>возраст</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)" }}>
                <b style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--yellow)" }}>{user.role === "admin" ? "Админ" : "Зритель"}</b>
                <span style={{ fontSize: "11px", opacity: 0.65 }}>роль</span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)" }}>
                <b style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--yellow)" }}>{user.isAgeVerified ? "Да" : "Нет"}</b>
                <span style={{ fontSize: "11px", opacity: 0.65 }}>18+ подтверждён</span>
              </div>
            </div>
          </div>
        </div>

        <button onClick={handleLogout} style={{ marginTop: "24px", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "13px", padding: "12px 24px", border: "2px solid var(--line)", background: "var(--surface)", color: "var(--text)", cursor: "pointer" }}>
          Выйти
        </button>

        <div style={{ marginTop: "40px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "3px solid var(--line)", paddingBottom: "10px", marginBottom: "22px" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", margin: 0 }}>
              Избранное <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 400 }}>({favorites.length})</span>
            </h2>
          </div>

          {favorites.length === 0 ? (
            <p style={{ color: "var(--muted)", fontSize: "13px" }}>Пока пусто — добавляй тайтлы через ♡ на странице плеера</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "22px" }}>
              {favorites.map((a) => (
                <Card key={a.id} anime={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "60px 28px" }}>
      <div style={{ background: "var(--surface)", border: "3px solid var(--line)", boxShadow: "6px 6px 0 var(--line)", padding: "30px" }}>
        <div style={{ display: "flex", marginBottom: "24px" }}>
          <button onClick={() => { setMode("login"); setError(null); }} style={{ flex: 1, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", padding: "12px", border: "2px solid var(--line)", background: mode === "login" ? "var(--text)" : "var(--surface)", color: mode === "login" ? "var(--yellow)" : "var(--text)", cursor: "pointer" }}>
            Вход
          </button>
          <button onClick={() => { setMode("register"); setError(null); }} style={{ flex: 1, fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", padding: "12px", border: "2px solid var(--line)", borderLeft: "none", background: mode === "register" ? "var(--text)" : "var(--surface)", color: mode === "register" ? "var(--yellow)" : "var(--text)", cursor: "pointer" }}>
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {mode === "register" && (
            <input name="username" placeholder="Имя пользователя" value={form.username} onChange={handleChange} required style={inputStyle} />
          )}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={inputStyle} />
          <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} required style={inputStyle} />
          {mode === "register" && (
            <input name="age" type="number" placeholder="Возраст" value={form.age} onChange={handleChange} required style={inputStyle} />
          )}

          {error && <p style={{ color: "var(--magenta)", fontSize: "13px", margin: 0 }}>{error}</p>}

          <button type="submit" disabled={loading} style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "14px", textTransform: "uppercase", padding: "14px", border: "2px solid var(--line)", background: "var(--magenta)", color: "#fff", boxShadow: "4px 4px 0 var(--yellow)", cursor: "pointer", marginTop: "6px" }}>
            {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;