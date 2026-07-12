const express = require("express");
const router = express.Router()
const { getCommentsByAnime, createComment } = require("../controllers/commentController")
const { verifyToken } = require("../middleware/authMiddleware")

router.get("/:animeId", getCommentsByAnime)
router.post("/:animeId", verifyToken, createComment)

module.exports = router