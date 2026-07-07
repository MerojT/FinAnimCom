require("reflect-metadata");
const axios = require("axios");
const { AppDataSource } = require("./config/data-source");

async function fetchTrailerByTitle(title, attempt = 1) {
  try {
    const res = await axios.get("https://api.jikan.moe/v4/anime", {
      params: { q: title, limit: 1 },
    });
    const match = res.data.data[0];
    return match?.trailer?.embed_url || null;
  } catch (err) {
    if (err.response?.status === 429 && attempt <= 3) {
      const wait = 2000 * attempt; 
      console.log(`  429 — жду ${wait}мс и пробую снова...`);
      await new Promise((r) => setTimeout(r, wait));
      return fetchTrailerByTitle(title, attempt + 1);
    }
    throw err;
  }
}

async function run() {
  await AppDataSource.initialize();
  const animeRepo = AppDataSource.getRepository("Anime");

  const missing = await animeRepo
    .createQueryBuilder("anime")
    .where("anime.trailerUrl IS NULL")
    .getMany();

  console.log(`Осталось без трейлера: ${missing.length}, пробую снова...`);

  for (const anime of missing) {
    try {
      const trailerUrl = await fetchTrailerByTitle(anime.title);
      if (trailerUrl) {
        anime.trailerUrl = trailerUrl;
        await animeRepo.save(anime);
        console.log(`✓ ${anime.title} — найден`);
      } else {
        console.log(`— ${anime.title} — трейлера действительно нет на MAL`);
      }
    } catch (err) {
      console.error(`✗ ${anime.title} — окончательная ошибка:`, err.message);
    }
    await new Promise((r) => setTimeout(r, 1200)); 
  }

  console.log("Готово!");
  await AppDataSource.destroy();
}

run().catch((err) => {
  console.error("Ошибка скрипта:", err);
  process.exit(1);
});
