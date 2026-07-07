require("reflect-metadata");
const { AppDataSource } = require("./config/data-source");

const manualTrailers = [
  { title: "Gintama Season 4", videoId: "t_VrBTGerUM" },
  { title: "Gintama Season 2", videoId: "euduSmV01bc" },
  { title: "Gintama: Enchousen", videoId: "e5x47GIm6Po" },
  { title: "Gintama", videoId: "YQC3ot0IjiA" },
  { title: "Hunter x Hunter", videoId: "d6kBeJjTGnY" },
  { title: "Code Geass: Lelouch of the Rebellion R2", videoId: "HyDqROvRDVM" },
  { title: "Code Geass: Lelouch of the Rebellion", videoId: "TvW8Z5fBl0E" },
  { title: "Monster", videoId: "m3Bsyozf_8I" },
  { title: "Tomorrow's Joe 2", videoId: "oWdfhTkwW2w" },
  { title: "Fighting Spirit", videoId: "a94NcwNgPdo" },
  { title: "Samurai X: Trust and Betrayal", videoId: "MhKyFMKVtBk" },
];

async function run() {
  await AppDataSource.initialize();
  const animeRepo = AppDataSource.getRepository("Anime");

  for (const item of manualTrailers) {
    const anime = await animeRepo.findOneBy({ title: item.title });
    if (!anime) {
      console.log(`✗ Не найден в базе: ${item.title}`);
      continue;
    }
    anime.trailerUrl = `https://www.youtube-nocookie.com/embed/${item.videoId}?enablejsapi=1&wmode=opaque&autoplay=1`;
    await animeRepo.save(anime);
    console.log(`✓ ${item.title} — обновлён`);
  }

  console.log("Готово!");
  await AppDataSource.destroy();
}

run().catch((err) => {
  console.error("Ошибка:", err);
  process.exit(1);
});
