const express = require("express");
const router = express.Router()
const { getAllUsers, banUser, unbanUser } = require("../controllers/userController")
const { verifyToken, checkAdmin } = require("../middleware/authMiddleware")

router.get("/", verifyToken, checkAdmin, getAllUsers)
router.patch("/:id/ban", verifyToken, checkAdmin, banUser)
router.patch("/:id/unban", verifyToken, checkAdmin, unbanUser)

module.exports = router
