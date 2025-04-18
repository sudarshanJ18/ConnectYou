const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Mentor = require("../models/mentor");

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// POST route to create a mentor
router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("File uploaded:", req.file);

    const { name, role, company, expertise, rating, availability, sessions } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "Image file is required." });
    }

    const newMentor = new Mentor({
      name,
      role,
      company,
      expertise: expertise.split(","),
      rating,
      availability,
      sessions: sessions || 0,
      image: req.file.path
    });

    await newMentor.save();
    res.status(201).json({ message: "Mentor created successfully", mentor: newMentor });
  } catch (err) {
    console.error("❌ Error creating mentor:", err);
    res.status(400).json({
      error: "Invalid data",
      details: err.message
    });
  }
});

// ✅ GET route to fetch all mentors
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).json(mentors);
  } catch (err) {
    console.error("❌ Error fetching mentors:", err);
    res.status(500).json({ error: "Failed to fetch mentors", details: err.message });
  }
});

module.exports = router;
