import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const load = () => {
    api.get("/users").then((res) => setUsers(res.data)).catch((err) => setError(err.response?.data?.error || "Ошибка"));
  };

  useEffect(() => {
    load();
  }, []);

  const handleBan = async (id) => {
    const reason = prompt("Причина бана:");
    if (!reason) return;
    try {
      await api.patch(`/users/${id}/ban`, { reason });
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Ошибка");
    }
  };

  const handleUnban = async (id) => {
    try {
      await api.patch(`/users/${id}/unban`);
      load();
    } catch (err) {
      alert(err.response?.data?.error || "Ошибка");
    }
  };

  if (error) return <p style={{ padding: "48px 28px" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 28px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "3px solid var(--line)", paddingBottom: "10px", marginBottom: "22px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", margin: 0 }}>Пользователи</h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {users.map((u) => (
          <div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface)", border: "2px solid var(--line)", padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "13px" }}>
            <div>
              <b>{u.username}</b> ({u.email}) — {u.role}
              {u.isBanned && <span style={{ color: "var(--magenta)", marginLeft: "10px" }}>ЗАБАНЕН: {u.banReason}</span>}
            </div>
            <div>
              {u.role !== "admin" &&
                (u.isBanned ? (
                  <button onClick={() => handleUnban(u.id)} style={btnStyle("var(--cyan)")}>
                    Снять бан
                  </button>
                ) : (
                  <button onClick={() => handleBan(u.id)} style={btnStyle("var(--magenta)", "#fff")}>
                    Забанить
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function btnStyle(bg, color = "#14121A") {
  return { fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "12px", padding: "6px 14px", border: "2px solid var(--line)", background: bg, color, cursor: "pointer" };
}

export default AdminUsers;