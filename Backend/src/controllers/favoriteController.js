const { AppDataSource } = require("../config/data-source");

const addFavorite = async (req, res) => {
  try {
    const animeId = parseInt(req.params.animeId);
    const favoriteRepo = AppDataSource.getRepository("Favorite");

    const existing = await favoriteRepo.findOne({
      where: { user: { id: req.user.id }, anime: { id: animeId } },
    });
    if (existing) {
      return res.status(409).json({ error: "Уже в избранном" });
    }

    const favorite = favoriteRepo.create({
      user: { id: req.user.id },
      anime: { id: animeId },
    });
    await favoriteRepo.save(favorite);
    res.status(201).json({ message: "Добавлено в избранное" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const animeId = parseInt(req.params.animeId);
    const favoriteRepo = AppDataSource.getRepository("Favorite");

    const existing = await favoriteRepo.findOne({
      where: { user: { id: req.user.id }, anime: { id: animeId } },
    });
    if (!existing) {
      return res.status(404).json({ error: "Не найдено в избранном" });
    }

    await favoriteRepo.remove(existing);
    res.json({ message: "Удалено из избранного" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getMyFavorites = async (req, res) => {
  try {
    const favoriteRepo = AppDataSource.getRepository("Favorite");
    const favorites = await favoriteRepo.find({
      where: { user: { id: req.user.id } },
      relations: { anime: true },
      order: { createdAt: "DESC" },
    });
    res.json(favorites.map((f) => f.anime));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const checkFavorite = async (req, res) => {
  try {
    const animeId = parseInt(req.params.animeId);
    const favoriteRepo = AppDataSource.getRepository("Favorite");
    const existing = await favoriteRepo.findOne({
      where: { user: { id: req.user.id }, anime: { id: animeId } },
    });
    res.json({ isFavorite: !!existing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { addFavorite, removeFavorite, getMyFavorites, checkFavorite };
