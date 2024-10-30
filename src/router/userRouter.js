import express from "express";
import {
  loginUser,
  registerUser,
  refreshAccessToken,
  logout,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);

export default router;
