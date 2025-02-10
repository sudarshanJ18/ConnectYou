const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();  // Load environment variables

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);
