const express = require("express");
const router = express.Router();
const { addFavorite, removeFavorite, getMyFavorites, checkFavorite, } = require("../controllers/favoriteController")
const { verifyToken } = require("../middleware/authMiddleware")

router.get("/", verifyToken, getMyFavorites)
router.get("/check/:animeId", verifyToken, checkFavorite)
router.post("/:animeId", verifyToken, addFavorite)
router.delete("/:animeId", verifyToken, removeFavorite)

module.exports = router
