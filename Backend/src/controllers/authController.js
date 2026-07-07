const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AppDataSource } = require("../config/data-source");

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
}
const register = async (req, res) => {
  try {
    const { username, email, password, age } = req.body;
    if (!username || !email || !password || age === undefined || age === null || age === "") {
      return res.status(400).json({ error: "Заполните все поля, включая возраст" });
    }
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge <= 0 || parsedAge > 120) {
      return res.status(400).json({ error: "Некорректный возраст" });
    }
    const userRepo = AppDataSource.getRepository("User");
    const existing = await userRepo.findOne({ where: [{ email }, { username }] });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Пользователь с таким email или именем уже существует" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepo.create({
      username,
      email,
      password: hashedPassword,
      age: parsedAge,
      isAgeVerified: parsedAge >= 18,
      role: "user",
    });
    const saved = await userRepo.save(user);
    delete saved.password;
    const token = generateToken(saved);
    res.status(201).json({ token, user: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }
    if (user.isBanned) {
      return res.status(403).json({
        error: "banned",
        message: `Вы были забанены по причине: ${user.banReason || "не указана"}`,
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }
    const token = generateToken(user);
    delete user.password;
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login };
