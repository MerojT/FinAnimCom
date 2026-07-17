const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Anime",
  tableName: "anime",
  columns: {
    id: { primary: true, type: "int", generated: true },
    title: { type: "varchar" },
    genre: { type: "varchar" },
    episodes: { type: "int", default: 0 },
    rating: { type: "float", default: 0 },
    ageRestricted: { type: "boolean", default: false },
    posterUrl: { type: "varchar", nullable: true },
    trailerUrl: { type: "varchar", nullable: true },
    synopsis: { type: "text", nullable: true },
    status: { type: "varchar", default: "ongoing" },
    malId: { type: "int", nullable: true },
    playerUrl: { type: "varchar", nullable: true },
    createdAt: { type: "timestamp", createDate: true}
  },
})
