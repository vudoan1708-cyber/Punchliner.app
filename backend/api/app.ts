import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import passport from "passport";
import path from "path";
import mainRoutes from "./v1";
import { errorHandler } from "../middlewares/error-handler";
import { PassportJWTStrategy, PassportLocalStrategy } from "../configs/passport";
import PaymentController from "../controllers/payment";

// NOTE: init app instance
const app = express();

// NOTE: 3rd party webhooks
app.post(
  "/v1/stripe/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.registerStripeWebhookEvents
);

// NOTE: setup PUG view engine
app.set("view engine", "pug");

// NOTE: set security HTTP headers
app.use(helmet());

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

// NOTE: parse json request body
app.use(express.json());

// NOTE: parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", mainRoutes);

// NOTE: error handler
app.use(errorHandler);

// check if the app is running in production
if (process.env.NODE_ENV === 'production') {
  const root = path.join(__dirname, '../dist');

  // NOTE: serve static files
  app.use(express.static(root));

// otherwise
} else {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });
}

export default app;
