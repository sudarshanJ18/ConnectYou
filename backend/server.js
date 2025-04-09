const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const http = require("http"); // ✅ Added for HTTP server
const chatRoutes = require('./routes/chatRoutes');
const chatSocket = require('./socket/socket');

dotenv.config();

const requiredEnvVars = [
    'MONGODB_URI',
    'GEMINI_API_KEY',
    'JWT_SECRET',
    'NODE_ENV'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
}

// Import all routes
const profileRoutes = require('./routes/profile');
// const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const coursesRoutes = require('./routes/courses');
const mentorRoutes = require('./routes/mentor');
const usersRoutes = require('./routes/users');
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

const app = express();

// Security and logging middleware
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later"
});
app.use("/api/", limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.ALLOWED_ORIGINS?.split(',') 
        : '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Log all incoming requests for debugging
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url} - Headers:`, req.headers);
    next();
});

// Custom request logging middleware
app.use(requestLogger);

// Routes
app.use("/api/profile", profileRoutes);
// app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/courses", coursesRoutes);
app.use("/api/mentor", mentorRoutes);
app.use("/api/users", usersRoutes);
app.use('/api/chats', chatRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    const status = {
        timestamp: new Date().toISOString(),
        service: "ConnectYou API",
        status: "OK",
        mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        aiService: process.env.GEMINI_API_KEY ? "Configured" : "Not Configured"
    };
    res.json(status);
});

// MongoDB connection with retry mechanism
const connectDB = async (retries = 5) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/connectyou', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected");
    } catch (err) {
        if (retries > 0) {
            console.log(`❌ MongoDB connection failed. Retrying... (${retries} attempts left)`);
            setTimeout(() => connectDB(retries - 1), 5000);
        } else {
            console.error("❌ MongoDB Connection Error:", err);
            process.exit(1);
        }
    }
};

// Global error handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async () => {
    console.log('🔄 Received shutdown signal');
    try {
        await mongoose.connection.close();
        console.log('📦 MongoDB connection closed');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during graceful shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    if (process.env.NODE_ENV === 'development') {
        process.exit(1);
    }
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`
🚀 Server is running
📍 PORT: ${PORT}
🌍 ENV: ${process.env.NODE_ENV}
⏰ Time: ${new Date().toLocaleString()}
    `);
});

connectDB();
chatSocket(io);

module.exports = { app, server };
