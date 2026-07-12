const express = require("express");
const router = express.Router()
const { getAllAnime, getAnimeById, createAnime, getRandomAnime, getGenres } = require("../controllers/animeController")
const { verifyToken, checkAdmin, optionalAuth } = require("../middleware/authMiddleware")

router.get("/", optionalAuth, getAllAnime)
router.get("/random", optionalAuth, getRandomAnime)
router.get("/genres", getGenres)
router.get("/:id", optionalAuth, getAnimeById)
router.post("/", verifyToken, checkAdmin, createAnime)

module.exports = router
