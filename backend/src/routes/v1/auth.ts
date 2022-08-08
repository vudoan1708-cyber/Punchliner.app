import express from "express";
import AuthController from "../../controllers/auth";

const router = express.Router();

router.post("/login", AuthController.login);

router.post("/register", () => {});

export default router;
