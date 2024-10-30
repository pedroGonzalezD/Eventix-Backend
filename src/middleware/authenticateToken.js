import { JWT_SECRET } from "../config.js";
import jwt from "jsonwebtoken";
import { refreshAccessToken } from "../controllers/userController.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json("access token not provided");
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json("Invalid access token");
    }

    req.user = user;
    next();
  });
};
