import { JWT_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json("Access denied. No token provided.");
  }

  jwt.verify(token, JWT_SECRET, (err, decoded, user) => {
    if (err) {
      return res.status(403).json("Invalid token");
    }

    if (!decoded.isAdmin) {
      return res.status(403).json("Access denied. Admins only.");
    }

    req.user = user;
    next();
  });
};
