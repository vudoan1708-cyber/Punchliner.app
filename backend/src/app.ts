// // configure the connection to MongoDB
// import createConnection from "./data/connection";

// // MongoDB database
// import getAllData from "./logic/GetAllData";
// import createData from "./logic/CreateData";
// import updateData from "./logic/UpdateData";

// // Login
// import loginRoute from "./routes/auth";

// export default async (app) => {
//   // configure the connection to MongoDB databases
//   // 0 (accounts settings)
//   // 1 (documents settings)
//   const accounts_db = createConnection(0);
//   const documents_db = createConnection(1);

//   loginRoute(app, accounts_db);
// };

import express from "express";
import helmet from "helmet";
import cors from "cors";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import mainRoutes from "./routes/v1";

// NOTE: init app instance
const app = express();

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
app.options("*", cors());

// TODO: jwt authentication
// app.use(passport.initialize());
// passport.use("jwt", jwtStrategy);
// // limit repeated failed requests to auth endpoints
// if (config.env === "production") {
//   app.use("/v1/auth", authLimiter);
// }

app.use("/v1", mainRoutes);

export default app;
