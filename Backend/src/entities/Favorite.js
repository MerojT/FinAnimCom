const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Favorite",
  tableName: "favorites",
  columns: {
    id: { primary: true, type: "int", generated: true },
    createdAt: { type: "timestamp", createDate: true }
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      onDelete: "CASCADE"
    },
    anime: {
      type: "many-to-one",
      target: "Anime",
      joinColumn: true,
      onDelete: "CASCADE"
    }
  },
  uniques: [{ name: "unique_user_anime", columns: ["user", "anime"] }]
})
