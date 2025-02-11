const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const admin = require("../firebaseAdmin");

const router = express.Router();

// 🔹 User Registration (Email/Password)
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, userType, university, branch, yearOfStudy, studentId, graduationYear, currentCompany, jobTitle, industry } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists!" });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const newUser = new User({
      firstName, lastName, email, password: hashedPassword, phone, userType,
      university, branch, yearOfStudy, studentId,
      graduationYear, currentCompany, jobTitle, industry
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 User Login (Email/Password)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found!" });

    // Validate Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials!" });

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, user });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Verify Firebase Token and Store User in MongoDB (Social Login)
router.post("/verify-firebase-token", async (req, res) => {
  const { token, additionalData } = req.body;

  try {
    // Verify Firebase Token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, phone_number } = decodedToken;

    // Check if user exists in MongoDB
    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      // Create new user
      user = new User({
        firebaseUID: uid,
        email,
        phone: phone_number || "",
        ...additionalData, // Extra data from frontend (firstName, lastName, etc.)
      });

      await user.save();
    }

    // Generate JWT Token for API security
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "User verified & stored in MongoDB", user, jwtToken });
  } catch (error) {
    res.status(401).json({ error: "Invalid Firebase Token" });
  }
});

module.exports = router;
