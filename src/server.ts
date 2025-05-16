import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDb } from "./db";
import userRoutes from "./routes/userRoutes";
import { loadUsersData } from "./controllers/userController";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("👋 Hello World from Express + TypeScript!");
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("❗ Error:", err.stack);
    res.status(500).send("Something went wrong!");
  }
);

connectToDb()
  .then(async () => {
    console.log("✅ Connected to DB");

    // Load users on server start
    try {
      await loadUsersData();
      console.log("✅ Users data loaded into DB");
    } catch (error) {
      console.error("❌ Failed to load users data on startup:", error);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB. Server not started.", err);
    process.exit(1);
  });
