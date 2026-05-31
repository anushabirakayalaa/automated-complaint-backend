import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });

    // Check if user exists by checking email
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "USER"
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const refreshSecret = process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh");
    const refreshToken = jwt.sign(
      { userId: user._id },
      refreshSecret,
      { expiresIn: "7d" }
    );

    // Save refresh token in DB for session tracking/revocation
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ token: accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh Access Token
export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh");
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, refreshSecret);
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid session or refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({ token: newAccessToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout user (invalidates refresh token on the server)
export const logoutUser = async (req, res) => {
  try {
    const userId = req.user.userId;
    await User.findByIdAndUpdate(userId, { refreshToken: null });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
