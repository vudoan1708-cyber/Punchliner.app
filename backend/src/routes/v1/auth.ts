import express from "express";
import passport from "passport";
import AuthController from "../../controllers/auth";
import { schemaValidate } from "../../middlewares/schema-validator";
import { LoginSchema, RegisterSchema } from "../../schema/auth.schema";

const router = express.Router();

router.post(
  "/login",
  schemaValidate(LoginSchema),
  passport.authenticate("local", { session: false }),
  AuthController.login
);

router.post(
  "/register",
  schemaValidate(RegisterSchema),
  AuthController.register
);

export default router;
