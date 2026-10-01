import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const emailRegex = /^\S+@\S+\.\S+$/;
const makeToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || name.trim().length < 2)
      return res.status(400).json({ message: "Name kam se kam 2 characters ka ho" });
    if (!emailRegex.test(email || ""))
      return res.status(400).json({ message: "Valid email daalo" });
    if (!password || password.length < 6)
      return res.status(400).json({ message: "Password kam se kam 6 characters ka ho" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: "Email already registered hai" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ token: makeToken(user._id), name: user.name });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!emailRegex.test(email || "") || !password)
      return res.status(400).json({ message: "Email aur password dono daalo" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Email ya password galat hai" });

    res.json({ token: makeToken(user._id), name: user.name });
  } catch (err) {
    next(err);
  }
});

export default router;