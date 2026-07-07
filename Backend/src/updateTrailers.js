require("reflect-metadata");
const axios = require("axios");
const { AppDataSource } = require("./config/data-source");

async function fetchTrailerByTitle(title) {
  const res = await axios.get("https://api.jikan.moe/v4/anime", {
    params: { q: title, limit: 1 },
  });
  const match = res.data.data[0];
  return match?.trailer?.embed_url || null;
}

async function run() {
  await AppDataSource.initialize();
  const animeRepo = AppDataSource.getRepository("Anime");

  const allAnime = await animeRepo.find();
  console.log(`Найдено ${allAnime.length} тайтлов, обновляю трейлеры...`);

  for (const anime of allAnime) {
    try {
      const trailerUrl = await fetchTrailerByTitle(anime.title);
      if (trailerUrl) {
        anime.trailerUrl = trailerUrl;
        await animeRepo.save(anime);
        console.log(`✓ ${anime.title} — трейлер найден`);
      } else {
        console.log(`— ${anime.title} — трейлер не найден`);
      }
    } catch (err) {
      console.error(`✗ ${anime.title} — ошибка:`, err.message);
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log("Готово!");
  await AppDataSource.destroy();
}

run().catch((err) => {
  console.error("Ошибка скрипта:", err);
  process.exit(1);
});
