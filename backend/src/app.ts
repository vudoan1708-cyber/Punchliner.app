import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import passport from "passport";
import mainRoutes from "./routes/v1";
import { errorHandler } from "./middlewares/error-handler";
import { PassportJWTStrategy, PassportLocalStrategy } from "./configs/passport";

// NOTE: init app instance
const app = express();

// NOTE: setup PUG view engine
app.set("view engine", "pug");

// NOTE: set security HTTP headers
app.use(helmet());

// NOTE: parse json request body
app.use(express.json());

// NOTE: parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// NOTE: sanitize request data
app.use(mongoSanitize());

// NOTE: gzip compression
app.use(compression());

// NOTE: enable cors
app.use(cors());
// app.options("*", cors());

// NOTE: jwt authentication
app.use(passport.initialize());
passport.use(PassportLocalStrategy);
passport.use(PassportJWTStrategy);

app.use("/v1", mainRoutes);

// NOTE: error handler
app.use(errorHandler);

export default app;
