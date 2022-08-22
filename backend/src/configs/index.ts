import dotenv from "dotenv";

dotenv.config();

export default {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 5000,
  ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET || "",
  STRIPE_API_KEY: process.env.STRIPE_API_KEY || "",
  HOST: process.env.HOST || "",
};
