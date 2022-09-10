import config from "./configs";
import logger from "./configs/logger";
import app from "./app";
import type { Server } from "http";

const server: Server | null = app.listen(config.PORT, () => {
  logger.info(`Listening to port ${config.PORT}`);
});

if (
  !config.MONGODB_URI ||
  config.MONGODB_URI === "" ||
  !config.JWT_SECRET ||
  config.JWT_SECRET === ""
) {
  logger.error("No config provided (MongoDB URI or JWT secret)");
  process.exit(1);
}

// mongoose.connect(config.MONGODB_URI).then(() => {
//   logger.info("Connected to MongoDB");
//   server = app.listen(config.PORT, () => {
//     logger.info(`Listening to port ${config.PORT}`);
//   });
// });

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

const unexpectedErrorHandler = (error: Error | any) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

// process.on("SIGTERM", () => {
//   logger.info("SIGTERM received");
//   if (server) {
//     server.close();
//   }
// });
