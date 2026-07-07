const { AppDataSource } = require("../config/data-source");

const getCommentsByAnime = async (req, res) => {
  try {
    const commentRepo = AppDataSource.getRepository("Comment");
    const comments = await commentRepo.find({
      where: { anime: { id: parseInt(req.params.animeId) } },
      relations: { user: true },
      order: { createdAt: "DESC" },
    });
    const safe = comments.map((c) => ({
      id: c.id,
      text: c.text,
      createdAt: c.createdAt,
      username: c.user.username,
    }));

    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const createComment = async (req, res) => {
  try {
    const { text } = req.body;
    const animeId = parseInt(req.params.animeId);

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ error: "Комментарий не может быть пустым" });
    }
    if (text.length > 1000) {
      return res.status(400).json({ error: "Слишком длинный комментарий" });
    }

    const animeRepo = AppDataSource.getRepository("Anime");
    const anime = await animeRepo.findOneBy({ id: animeId });
    if (!anime) {
      return res.status(404).json({ error: "Тайтл не найден" });
    }

    const commentRepo = AppDataSource.getRepository("Comment");
    const comment = commentRepo.create({
      text: text.trim(),
      user: { id: req.user.id },
      anime: { id: animeId },
    });
    const saved = await commentRepo.save(comment);

    res.status(201).json({
      id: saved.id,
      text: saved.text,
      createdAt: saved.createdAt,
      username: req.user.username || "Вы",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getCommentsByAnime, createComment };
