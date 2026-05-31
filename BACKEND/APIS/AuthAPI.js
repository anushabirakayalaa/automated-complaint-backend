import express from "express";
import { registerUser, loginUser, refreshAccessToken, logoutUser } from "../services/authService.js";
import verifyToken from "../middlewares/verifyToken.js";

export const authRoute = express.Router();

authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);
authRoute.post("/refresh", refreshAccessToken);
authRoute.post("/logout", verifyToken, logoutUser);