const { AppDataSource } = require("../config/data-source");

async function isRequestAgeVerified(req) {
  if (!req.user) return false;
  const userRepo = AppDataSource.getRepository("User");
  const user = await userRepo.findOneBy({ id: req.user.id });
  return !!(user && user.isAgeVerified && !user.isBanned);
}

const getAllAnime = async (req, res) => {
  try {
    const animeRepo = AppDataSource.getRepository("Anime");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const qb = animeRepo.createQueryBuilder("anime");

    if (req.query.genres) {
      const genreArray = req.query.genres.split(",").map((g) => g.trim());
      qb.andWhere("anime.genre IN (:...genreArray)", { genreArray });
    }
    if (req.query.status && req.query.status !== "all") {
      qb.andWhere("anime.status = :status", { status: req.query.status });
    }

    const ageVerified = await isRequestAgeVerified(req);
    if (!ageVerified) {
      qb.andWhere("anime.ageRestricted = false");
    }

    const [anime, total] = await qb
      .orderBy("anime.rating", "ASC")
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    res.json({ data: anime, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getAnimeById = async (req, res) => {
  try {
    const animeRepo = AppDataSource.getRepository("Anime");
    const anime = await animeRepo.findOneBy({ id: parseInt(req.params.id) });
  if (!anime) {
    return res.status(404).json({ error: "Аниме не найдено" });
  }
  if (anime.ageRestricted) {
    const ageVerified = await isRequestAgeVerified(req);
    if (!ageVerified) {
      return res
        .status(403)
        .json({
          error: "age_restricted",
          message: "Разрешено только для 18 летних",
        });
    }
  } res.json(anime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const createAnime = async (req, res) => {
  try {
    const {title, genre, episodes, rating, trailerUrl, ageRestricted, posterUrl, synopsis, status, malId, playerUrl} = req.body;
    if (!title || typeof title !== "string" || title.trim() === "") {
      return res.status(400).json({error: "Поле title обязательно"})
    }
    const animeRepo = AppDataSource.getRepository("Anime")
    const newAnime = animeRepo.create({
      title: title.trim(),
      genre: genre || "Anime",
      episodes: Number.isInteger(episodes) ? episodes : 0,
      rating: typeof rating === "number" ? rating : 0,
      ageRestricted: !!ageRestricted,
      posterUrl: posterUrl || null,
      trailerUrl: trailerUrl || null, 
      synopsis: synopsis || "",
      status: status || "ongoing",
      malId: malId ? parseInt(malId) : null,
      playerUrl: playerUrl || null,
    })

    const saved = await animeRepo.save(newAnime);
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error "})
  }
};

const getRandomAnime = async (req, res) => {
  try {
    const animeRepo = AppDataSource.getRepository("Anime");
    const ageVerified = await isRequestAgeVerified(req);

    const qb = animeRepo.createQueryBuilder("anime");
    if (!ageVerified) qb.andWhere("anime.ageRestricted = false");

    const anime = await qb.orderBy("RANDOM()").limit(1).getOne();
    if (!anime) return res.status(404).json({ error: "Каталог Пуст" });
    res.json(anime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getGenres = async (req, res) => {
  try {
    const animeRepo = AppDataSource.getRepository("Anime");
    const rows = await animeRepo
      .createQueryBuilder("anime")
      .select("DISTINCT anime.genre", "genre")
      .orderBy("anime.genre", "ASC")
      .getRawMany();
    res.json(rows.map((r) => r.genre));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllAnime, getAnimeById, createAnime, getRandomAnime, getGenres };
