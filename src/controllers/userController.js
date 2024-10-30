import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_TOKEN_SECRET } from "../config.js";
import Token from "../models/token.js";

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json("All fields are required");
  }

  if (password !== confirmPassword) {
    return res.status(400).json("password do not match");
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json("The email is already in use");
    }

    const hashed = await User.hashPassword(password);
    const newUser = new User({ firstName, lastName, email, password: hashed });
    await newUser.save();

    res.status(201).json("User registered successfully");
  } catch {
    res.status(500).json("Error registering User");
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json("incorrect email or password");
    }

    const isValid = await User.comparePassword(password, user.password);

    if (!isValid) {
      return res.status(400).json("Incorrect email or password");
    }

    const expiration = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "1d",
      algorithm: "HS256",
    });

    await new Token({ token: refreshToken, expiresAt: expiration }).save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const accessToken = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      {
        expiresIn: "15m",
        algorithm: "HS256",
      }
    );

    res.status(200).json({
      firstName: user.firstName,
      id: user._id,
      accessToken,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(500).json("Error logging in");
  }
};

export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json("No refresh token found");
  }

  const found = await Token.findOne({ token: refreshToken });

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json("invalid refresh token");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json("user not found");
    }

    const newAccessToken = jwt.sign(
      { id: user._id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "15m", algorithm: "HS256" }
    );

    res.json({
      firstName: user.firstName,
      newAccessToken: newAccessToken,
      isAdmin: user.isAdmin,
    });

    return {
      firstName: user.firstName,
      newAccessToken: newAccessToken,
      isAdmin: user.isAdmin,
    };
  });
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(204).json({ message: "No token found" });
    }

    await Token.findOneAndDelete({ token: refreshToken });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error al hacer logout:", error);
    return res.status(500).json({ message: "Error during logout" });
  }
};
