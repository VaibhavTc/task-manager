import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Task from "./models/Task.js";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);

mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "demo@example.com";
    const password = "demo123";

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, password });
      await user.save();
      console.log(`🆕 Created user: ${email}`);
    } else {
      console.log(`✅ User already exists: ${email}`);
    }

    const existingTasks = await Task.find({ userId: user._id });
    if (existingTasks.length === 0) {
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
          userId: user._id,
        },
      ];

      await Task.insertMany(tasks);
      console.log(`📝 Seeded ${tasks.length} tasks for ${email}`);
    } else {
      console.log(`📋 Tasks already seeded for ${email}`);
    }

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
};

seed();
