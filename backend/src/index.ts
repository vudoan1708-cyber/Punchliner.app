// import http from "http";
// import express from "express";
// import cors from "cors";
// import path from "path";
// import registerRoutes from "./server";
// import configs from "./configs";

// const root = path.join(__dirname, "../dist");

// const port = configs.PORT;

// const app = express();

// const server = http.createServer(app);

// // listening to any dynamic port number
// server.listen(port, () => console.log("Listening on port " + port));

// // SETUP MIDDLEWARES
// app.use(express.json({ limit: "1mb" }));
// app.use(cors());

// // check if the app is running in production
// if (process.env.NODE_ENV === "production") {
//   // use the static files
//   app.use(express.static(root));

//   // otherwise
// } else {
//   app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept"
//     );
//     next();
//   });
// }

// // register routes
// registerRoutes(app);

import mongoose from "mongoose";
import config from "./configs";
import logger from "./configs/logger";
import app from "./app";
import type { Server } from "http";

let server: Server | null;

mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info("Connected to MongoDB");
  server = app.listen(config.PORT, () => {
    logger.info(`Listening to port ${config.PORT}`);
  });
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});
