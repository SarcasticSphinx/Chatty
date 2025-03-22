import express from "express";
import {
  checkAuth,
  handleLogIn,
  handleLogOut,
  handleSignUp,
  handleUpdateProfile,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post("/signUp", handleSignUp);
router.post("/logIn", handleLogIn);
router.post("/logOut", handleLogOut);
router.put('/update', protectedRoute ,handleUpdateProfile)
router.get('/check', protectedRoute, checkAuth)

export default router;
