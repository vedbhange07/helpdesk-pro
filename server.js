const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");


dotenv.config();

const app = express();
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const ticketRoutes = require("./routes/ticketRoutes");


// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/tickets", ticketRoutes);
// Health Check API
app.post("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HelpDesk Pro API is running!",
        database:"connected"
    });
});

// Start server after database connection
const startServer = async () => {
    try {
        await connectDB();

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();