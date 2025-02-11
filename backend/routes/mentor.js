const express = require("express");
const Mentor = require("../models/Mentor");
const router = express.Router();

// ✅ Get all mentors
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ Add a new mentor
router.post("/", async (req, res) => {
  try {
    const newMentor = new Mentor(req.body);
    await newMentor.save();
    res.status(201).json(newMentor);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// ✅ Delete a mentor
router.delete("/:id", async (req, res) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ message: "Mentor deleted" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;
