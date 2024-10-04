import express from "express";

import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

//import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import client from "./utils/redis/client";

import path from "path";

import passport from "./middlewares/authentication/jwt";
import { errorHandler } from "./middlewares/errorHandler";

import dotenv from "dotenv";
dotenv.config();

import productRoutes from "./routes/productRoutes";
//import userRoutes from "./routes/userRoutes";
import siteSettingRoutes from "./routes/siteSettingsRoutes";
import uploadRoutes from "./routes/uploadRoute";

const app = express();

//Parsers
app.use(bodyParser.json({ limit: "2mb" }));
//app.use(cookieParser());

// Security middlewares
app.use(helmet()); //HTTP Headers
//app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use(cors());
//app.set("trust proxy", 1);

// Initialize passport
app.use(passport.initialize());

// Error Handler
app.use(errorHandler);

const staticFilesPath = path.resolve(
  __dirname,
  process.env.STATIC_FILES_PATH || ""
);

async function startServer() {
  //Routes
  app.use("/api", productRoutes);
  app.use("/api", siteSettingRoutes);
  app.use("/api", uploadRoutes);
  app.use("/api/public", express.static(staticFilesPath));

  //Cache Redis
  if (process.env.REDIS_ENABLED === "true") {
    client.connect();
  }
}
startServer().catch((error) => {
  console.error("Error starting server:", error);
  process.exit(1);
});

export default app;
