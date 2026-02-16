import express from "express";

import { registerUser, loginUser } from "../services/authService.js";

export const authRoute = express.Router();
//register and login operations in----authService.js
authRoute.post("/register", registerUser);
authRoute.post("/login", loginUser);