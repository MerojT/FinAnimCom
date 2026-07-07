const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Comment",
  tableName: "comments",
  columns: {
    id: { primary: true, type: "int", generated: true },
    text: { type: "text" },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      onDelete: "CASCADE",
    },
    anime: {
      type: "many-to-one",
      target: "Anime",
      joinColumn: true,
      onDelete: "CASCADE",
    },
  },
});
