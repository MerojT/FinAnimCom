import { useEffect, useState } from "react";
import api from "../api/axios";
import Card from "../components/Card";
import Hero from "../components/Hero";

function Home() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/anime?page=1&limit=10")
      .then((res) => setAnime(res.data.data))
      .catch((err) => {
        console.error(err);
        setError("Не удалось загрузить каталог");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 28px" }}>
      <Hero />

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "3px solid var(--line)", paddingBottom: "10px", marginBottom: "22px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "22px", margin: 0 }}>В тренде этого сезона</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "22px" }}>
        {anime.map((a) => (
          <Card key={a.id} anime={a} />
        ))}
      </div>
    </div>
  );
}

export default Home;