const { AppDataSource } = require("../config/data-source");

const getAllUsers = async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository("User");
    const users = await userRepo.find({ order: { createdAt: "DESC" } });
    const safe = users.map((u) => ({
      id: u.id,
      username: u.username,
      email: u.email,
      role: u.role,
      isBanned: u.isBanned,
      banReason: u.banReason,
      createdAt: u.createdAt,
    }));
    res.json(safe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const banUser = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim() === "") {
      return res.status(400).json({ error: "Укажите причину бана" });
    }

    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOneBy({ id: parseInt(req.params.id) });
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    if (user.role === "admin") {
      return res.status(403).json({ error: "Нельзя забанить администратора" });
    }

    user.isBanned = true;
    user.banReason = reason.trim();
    await userRepo.save(user);

    res.json({
      message: "Пользователь забанен",
      user: { id: user.id, isBanned: true, banReason: user.banReason },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const unbanUser = async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOneBy({ id: parseInt(req.params.id) });
    if (!user) return res.status(404).json({ error: "Пользователь не найден" });

    user.isBanned = false;
    user.banReason = null;
    await userRepo.save(user);

    res.json({ message: "Бан снят" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAllUsers, banUser, unbanUser };
