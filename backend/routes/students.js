import express from "express";
import Student from "../models/Student.js";
import auth from "../middleware/auth.js";

const router = express.Router();
router.use(auth);

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const validate = ({ name, email, phone, course, year }) => {
  if (!name || name.trim().length < 2) return "Name kam se kam 2 characters ka ho";
  if (!/^\S+@\S+\.\S+$/.test(email || "")) return "Valid email daalo";
  if (!/^[6-9]\d{9}$/.test(phone || "")) return "Phone number 10 digit ka valid ho";
  if (!course || !course.trim()) return "Course required hai";
  if (![1, 2, 3, 4].includes(Number(year))) return "Year 1 se 4 ke beech ho";
  return null;
};

// GET all (search + filter)
router.get("/", async (req, res, next) => {
  try {
    const { search, course, year } = req.query;
    const query = { createdBy: req.userId };
    if (search) {
      const rx = new RegExp(escapeRegex(search), "i");
      query.$or = [{ name: rx }, { email: rx }, { phone: rx }];
    }
    if (course) query.course = course;
    if (year) query.year = Number(year);
    const students = await Student.find(query).sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    next(err);
  }
});

// GET one
router.get("/:id", async (req, res, next) => {
  try {
    const s = await Student.findOne({ _id: req.params.id, createdBy: req.userId });
    if (!s) return res.status(404).json({ message: "Student nahi mila" });
    res.json(s);
  } catch (err) {
    next(err);
  }
});

// CREATE
router.post("/", async (req, res, next) => {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });
    const { name, email, phone, course, year } = req.body;
    const s = await Student.create({ name, email, phone, course, year, createdBy: req.userId });
    res.status(201).json(s);
  } catch (err) {
    next(err);
  }
});

// UPDATE
router.put("/:id", async (req, res, next) => {
  try {
    const error = validate(req.body);
    if (error) return res.status(400).json({ message: error });
    const { name, email, phone, course, year } = req.body;
    const s = await Student.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.userId },
      { name, email, phone, course, year },
      { new: true, runValidators: true }
    );
    if (!s) return res.status(404).json({ message: "Student nahi mila" });
    res.json(s);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete("/:id", async (req, res, next) => {
  try {
    const s = await Student.findOneAndDelete({ _id: req.params.id, createdBy: req.userId });
    if (!s) return res.status(404).json({ message: "Student nahi mila" });
    res.json({ message: "Student delete ho gaya" });
  } catch (err) {
    next(err);
  }
});

export default router;