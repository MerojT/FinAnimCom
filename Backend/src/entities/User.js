const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { primary: true, type: "int", generated: true },
    username: { type: "varchar", unique: true },
    email: { type: "varchar", unique: true },
    password: { type: "varchar" },
    age: { type: "int", nullable: true },
    role: { type: "varchar", default: "user" },
    isAgeVerified: { type: "boolean", default: false },
    isBanned: { type: "boolean", default: false },
    banReason: { type: "varchar", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
  },
});
