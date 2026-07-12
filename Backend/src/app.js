require("reflect-metadata");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { AppDataSource } = require("./config/data-source");
const app = express();
app.use(cors());
app.use(express.json());

const animeRoutes = require("./routes/animeRoutes");
app.use("/api/anime", animeRoutes)

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes)

const commentRoutes = require("./routes/commentRoutes");
app.use("/api/comments", commentRoutes)

const favoriteRoutes = require("./routes/favoriteRoutes");
app.use("/api/favorites", favoriteRoutes)

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes)

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("FinAnimCom API ishlamoqda");
})

AppDataSource.initialize()
.then(() => {
  console.log("Malumotlar bazasi ulandi")
  app.listen(PORT, () => {
    console.log(`Server bu http://localhost:${PORT} portda yoniq`)
  })
})
.catch((err) => {
  console.error("Baza ulanishida hato:", err)
})
