import dotenv from "dotenv";
import http from "http";
import express from "express";
import cors from "cors";
import path from "path";
import databaseRoute from "./routes/database";

// LOAD ENV
dotenv.config();

const root = path.join(__dirname, "../dist");
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

// listening to any dynamic port number
server.listen(port, () => console.log("Listening on port " + port));

// SETUP MIDDLEWARES
app.use(express.json({ limit: "1mb" }));
app.use(cors());

// check if the app is running in production
if (process.env.NODE_ENV === "production") {
  // use the static files
  app.use(express.static(root));

  // otherwise
} else {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
}

// register routes
databaseRoute(app);
