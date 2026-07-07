import { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "../components/Card";

function Catalog() {
  const [anime, setAnime] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allGenres, setAllGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [status, setStatus] = useState("all");
  const [showAdult, setShowAdult] = useState(true);

  useEffect(() => {
    api.get("/anime/genres").then((res) => setAllGenres(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 25 });
    if (selectedGenres.length) params.set("genres", selectedGenres.join(","));
    if (status !== "all") params.set("status", status);
    if (!showAdult) params.set("adult", "hide");

    api
      .get(`/anime?${params.toString()}`)
      .then((res) => {
        setAnime(res.data.data);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error(err);
        setError("Не удалось загрузить каталог");
      })
      .finally(() => setLoading(false));
  }, [page, selectedGenres, status, showAdult]);

  const toggleGenre = (g) => {
    setPage(1);
    setSelectedGenres((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));
  };

  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 28px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "3px solid var(--line)", paddingBottom: "10px", marginBottom: "22px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", margin: 0 }}>Каталог</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "32px", alignItems: "start" }}>
        <aside style={{ background: "var(--surface)", border: "3px solid var(--line)", boxShadow: "5px 5px 0 var(--line)", padding: "20px", position: "sticky", top: "90px" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "14px", margin: "0 0 14px", borderBottom: "2px solid var(--line)", paddingBottom: "8px" }}>
            Фильтры
          </h3>

          <div style={{ marginBottom: "22px" }}>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 10px" }}>Жанр</h4>
            {allGenres.map((g) => (
              <label key={g} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", marginBottom: "8px", cursor: "pointer" }}>
                <input type="checkbox" checked={selectedGenres.includes(g)} onChange={() => toggleGenre(g)} />
                {g}
              </label>
            ))}
          </div>

          <div>
            <h4 style={{ fontFamily: "var(--font-mono)", fontSize: "11px", textTransform: "uppercase", color: "var(--muted)", margin: "0 0 10px" }}>Статус</h4>
            {[
              { value: "all", label: "Все" },
              { value: "ongoing", label: "Онгоинг" },
              { value: "completed", label: "Завершено" },
            ].map((opt) => (
              <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", marginBottom: "8px", cursor: "pointer" }}>
                <input type="radio" name="status" checked={status === opt.value} onChange={() => { setPage(1); setStatus(opt.value); }} />
                {opt.label}
              </label>
            ))}
          </div>
        </aside>

        <div>
          {loading ? (
            <p>Загрузка...</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "22px" }}>
              {anime.map((a) => (
                <Card key={a.id} anime={a} />
              ))}
              {anime.length === 0 && <p>Ничего не найдено по выбранным фильтрам</p>}
            </div>
          )}

          <div style={{ display: "flex", gap: "8px", marginTop: "24px" }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{ fontFamily: "var(--font-mono)", fontWeight: p === page ? 700 : 400, padding: "8px 14px", border: "2px solid var(--line)", background: p === page ? "var(--text)" : "var(--surface)", color: p === page ? "var(--yellow)" : "var(--text)", cursor: "pointer" }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Catalog;