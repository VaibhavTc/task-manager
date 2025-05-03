import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import User from "./models/User.js";
import Task from "./models/Task.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

const app = express();

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  })
  .then(async () => {
    console.log("Connected to MongoDB");

    await seed();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

const seed = async () => {
  try {
    const userCount = await User.countDocuments();

    if (userCount === 0) {
      const email = "demo@example.com";
      const password = "demo123";

      let user = new User({ email, password });
      await user.save();
      console.log(`🆕 Created user: ${email}`);

      const tasks = [
        {
          title: "Finish project report",
          description: "Complete the final report by tomorrow.",
          priority: "High",
          dueDate: new Date(Date.now() + 3 * 86400000),
          userId: user._id,
        },
        {
          title: "Buy groceries",
          priority: "Low",
          dueDate: new Date(Date.now() + 1 * 86400000),
          userId: user._id,
        },
        {
          title: "Prepare presentation",
          description: "Slides and talking points for Monday's meeting.",
          priority: "Medium",
          completed: true,
          dueDate: new Date(Date.now() + 1 * 86400000),
          userId: user._id,
        },
      ];

      await Task.insertMany(tasks);
      console.log(`📝 Seeded ${tasks.length} tasks for ${email}`);
    } else {
      console.log("✅ User already exists. Skipping seed.");
    }
  } catch (err) {
    console.error("❌ Error seeding database:", err);
  }
};


app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : null,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
