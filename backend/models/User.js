const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firebaseUID: { type: String, unique: true }, // Firebase authentication
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String },
    avatar: String,
    password: { type: String }, 
    userType: { type: String, enum: ["student", "alumni"], required: true },
    
    // Academic Details
    university: { type: String },
    branch: { type: String },
    yearOfStudy: { type: String },
    studentId: { type: String },
    graduationYear: { type: String },

    // Professional Details
    currentCompany: { type: String },
    jobTitle: { type: String },
    industry: { type: String },

    // Course Enrollment
    enrolledCourses: [
      {
        course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        progress: { type: Number, default: 0 },
        completedLessons: [String],
        enrolledAt: { type: Date, default: Date.now },
      }
    ],

    // Roles & Permissions
    role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },

  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
