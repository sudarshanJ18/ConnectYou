const Profile = require("../models/Profile");
const User = require("../models/User");
const { validateProfile } = require("../middleware/validators");

// Get current user's profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Auth middleware sets req.user

    const profile = await Profile.findOne({ user: userId }).populate("user", ["name", "email", "avatar"]);

    if (!profile) {
      // Create a default profile if not found
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const defaultProfile = new Profile({
        user: userId,
        name: user.name || "New User",
        email: user.email || "Not provided",
        role: "Member",
        location: "Not specified",
        bio: "Tell us about yourself",
        skills: [],
        experience: [],
        education: [],
        social: { github: "", linkedin: "", twitter: "" }
      });

      await defaultProfile.save();
      return res.status(201).json(defaultProfile);
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    // Validate request body
    const validationResult = validateProfile(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.errors });
    }

    // Ensure skills is an array
    const updatedFields = {
      ...req.body,
      skills: Array.isArray(req.body.skills) ? req.body.skills : req.body.skills?.split(",").map(skill => skill.trim()),
      updatedAt: Date.now()
    };

    // Find and update profile, or create if not found
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: userId },
      { $set: updatedFields },
      { new: true, upsert: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error("Profile update error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getProfile, updateProfile };
