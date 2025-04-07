const Profile = require("../models/Profile");
const User = require("../models/User");
const { validateProfile } = require("../middleware/validators");

const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // use UUID from JWT payload

    console.log("User ID from token:", userId);

    const profile = await Profile.findOne({ user: userId }).populate("user", ["firstName", "lastName", "email"]);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.user_id; // use UUID

    const validationResult = validateProfile(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ message: validationResult.errors });
    }

    const updatedFields = {
      ...req.body,
      skills: Array.isArray(req.body.skills)
        ? req.body.skills
        : req.body.skills?.split(",").map(skill => skill.trim()),
      updatedAt: Date.now()
    };

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
