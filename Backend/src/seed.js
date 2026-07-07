require("reflect-metadata");
const axios = require("axios");
const { AppDataSource } = require("./config/data-source");

async function fetchPage(page) {
  const res = await axios.get(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`);
  return res.data.data.map((a) => ({
    title: a.title_english || a.title,
    genre: a.genres && a.genres.length ? a.genres[0].name : "Anime",
    episodes: a.episodes || 0,
    rating: a.score || 0,
    ageRestricted: /R\s*-|Rx/.test(a.rating || ""),
    posterUrl: a.images?.jpg?.large_image_url || null,
    synopsis: a.synopsis ? a.synopsis.slice(0, 500) : "",
    status: a.status === "Currently Airing" ? "ongoing" : "completed",
  }));
}

async function seed() {
  await AppDataSource.initialize();
  const animeRepo = AppDataSource.getRepository("Anime");

  for (let page = 1; page <= 3; page++) {
    console.log(`Загружаю страницу ${page}...`);
    const items = await fetchPage(page);
    await animeRepo.save(items);
    console.log(`Страница ${page} сохранена (${items.length} тайтлов)`);
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log("Готово! Всего в базе:", await animeRepo.count());
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error("Ошибка сидинга:", err);
  process.exit(1);
});
