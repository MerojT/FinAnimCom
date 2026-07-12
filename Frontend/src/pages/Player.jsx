import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { Navigate } from "react-router-dom";

function Player() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState(null);
  const [posting, setPosting] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  if (!currentUser) return <Navigate to="/profile" replace />;

  useEffect(() => {
    setLoading(true);
    setAnime(null);
    setError(null);
    api
      .get(`/anime/${id}`)
      .then((res) => setAnime(res.data))
      .catch((err) => {
        if (err.response?.status === 403) {
          setError(err.response.data.message);
        } else {
          setError("Тайтл не найден");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    api.get(`/comments/${id}`).then((res) => setComments(res.data)).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!currentUser) return;
    api.get(`/favorites/check/${id}`).then((res) => setIsFavorite(res.data.isFavorite)).catch(console.error);
  }, [id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError(null);
    if (!newComment.trim()) return;

    setPosting(true);
    try {
      const res = await api.post(`/comments/${id}`, { text: newComment });
      setComments((prev) => [{ ...res.data, username: currentUser?.username || "Вы" }, ...prev]);
      setNewComment("");
    } catch (err) {
      setCommentError(err.response?.data?.error || "Не удалось отправить комментарий");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <p style={{ padding: "48px 28px" }}>Загрузка...</p>;

  if (error) {
    return (
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 28px" }}>
        <div style={{ background: "var(--surface)", border: "3px solid var(--line)", boxShadow: "5px 5px 0 var(--line)", padding: "30px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "14px" }}>{error}</p>
          <Link to="/" style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "13px" }}>
            ← На главную
          </Link>
        </div>
      </div>
    );
  }

  if (!anime) return null;

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 28px" }}>
      <Link to="/" style={{ display: "inline-block", marginBottom: "20px", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "12px", textDecoration: "underline", color: "var(--text)" }}>
        ← Назад
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "28px", background: "var(--surface)", border: "3px solid var(--line)", boxShadow: "6px 6px 0 var(--line)", padding: "24px", marginBottom: "40px" }}>
        <img src={anime.posterUrl} alt={anime.title} style={{ width: "100%", height: "310px", objectFit: "cover", border: "2px solid var(--line)" }} />
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "26px", margin: "0 0 14px" }}>{anime.title}</h1>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
            <span style={tagStyle("var(--yellow)")}>{anime.genre}</span>
            <span style={tagStyle("var(--cyan)")}>{anime.episodes || "—"} эп.</span>
            <span style={tagStyle("var(--yellow)")}>★ {anime.rating}</span>
            <span style={tagStyle(anime.status === "ongoing" ? "var(--cyan)" : "#ddd")}>
              {anime.status === "ongoing" ? "Онгоинг" : "Завершено"}
            </span>
            {anime.ageRestricted && (
              <span style={{ ...tagStyle("#14121A"), color: "var(--magenta)", border: "2px solid var(--magenta)" }}>18+</span>
            )}
          </div>

          {currentUser && (
            <button onClick={toggleFavorite} style={{ marginBottom: "14px", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "13px", padding: "8px 16px", border: "2px solid var(--line)", background: isFavorite ? "var(--magenta)" : "var(--surface)", color: isFavorite ? "#fff" : "var(--text)", cursor: "pointer" }}>
              {isFavorite ? "♥ В избранном" : "♡ В избранное"}
            </button>
          )}

          <p style={{ fontSize: "14px", lineHeight: 1.6, color: "var(--muted)", margin: 0 }}>{anime.synopsis}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "3px solid var(--line)", paddingBottom: "10px", marginBottom: "22px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", margin: 0 }}>Трейлер</h2>
      </div>

      {anime.trailerUrl ? (
        <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, border: "3px solid var(--line)", boxShadow: "6px 6px 0 var(--line)", overflow: "hidden", marginBottom: "50px" }}>
          <iframe
            src={anime.trailerUrl}
            title={`Трейлер ${anime.title}`}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
          />
        </div>
      ) : (
        <div style={{ background: "var(--text)", color: "var(--bg)", border: "3px solid var(--line)", boxShadow: "6px 6px 0 var(--line)", padding: "60px 20px", textAlign: "center", fontFamily: "var(--font-mono)", fontSize: "13px", marginBottom: "50px" }}>
          Трейлер для этого тайтла недоступен
        </div>
      )}

      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", borderBottom: "3px solid var(--line)", paddingBottom: "10px", marginBottom: "22px" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "20px", margin: 0 }}>
          Комментарии <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", fontWeight: 400 }}>({comments.length})</span>
        </h2>
      </div>

      {currentUser ? (
        <form onSubmit={handleCommentSubmit} style={{ marginBottom: "30px" }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Написать комментарий..."
            rows={3}
            style={{ width: "100%", padding: "12px", border: "2px solid var(--line)", fontFamily: "var(--font-body)", fontSize: "14px", resize: "vertical", background: "var(--surface)", color: "var(--text)" }}
          />
          {commentError && <p style={{ color: "var(--magenta)", fontSize: "13px", margin: "6px 0" }}>{commentError}</p>}
          <button type="submit" disabled={posting} style={{ marginTop: "10px", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: "13px", padding: "10px 20px", border: "2px solid var(--line)", background: "var(--magenta)", color: "#fff", boxShadow: "3px 3px 0 var(--yellow)", cursor: "pointer" }}>
            {posting ? "Отправка..." : "Отправить"}
          </button>
        </form>
      ) : (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", marginBottom: "30px" }}>
          <Link to="/profile" style={{ textDecoration: "underline" }}>
            Войдите
          </Link>
          , чтобы оставить комментарий
        </p>
      )}

      <div>
        {comments.length === 0 && <p style={{ color: "var(--muted)", fontSize: "13px" }}>Пока нет комментариев — будь первым</p>}
        {comments.map((c) => (
          <div key={c.id} style={{ display: "flex", gap: "12px", padding: "14px 0", borderBottom: "1px solid #e3ded2" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--cyan)", border: "2px solid var(--line)", flex: "0 0 auto" }} />
            <div>
              <b style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}>{c.username}</b>
              <p style={{ margin: "4px 0 0", fontSize: "13px", lineHeight: 1.4 }}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function tagStyle(bg) {
  return { fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, padding: "4px 10px", border: "2px solid var(--line)", background: bg, color: "#14121A" };
}

export default Player;