import dotenv from "dotenv";

dotenv.config();

export default {
  MONGODB_URI: process.env.MONGODB_URI,
  PORT: process.env.PORT || 5000,
  ENV: process.env.NODE_ENV,
};
