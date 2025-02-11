const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firebaseUID: { type: String, required: true, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  userType: { type: String, enum: ["student", "alumni"], required: true },
  university: { type: String },
  branch: { type: String },
  yearOfStudy: { type: String },
  studentId: { type: String },
  graduationYear: { type: String },
  currentCompany: { type: String },
  jobTitle: { type: String },
  industry: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
