import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { FRONTEND_URL, MONGODB_URI } from "./config.js";
import userRouter from "./router/userRouter.js";
import eventRouter from "./router/eventRouter.js";
import path from "path";
import { authenticateToken } from "./middleware/authenticateToken.js";
import adminEventRouter from "./router/adminEventRouter.js";
import paymentRouter from "./router/paymentRouter.js";
import ticketRouter from "./router/ticketRouter.js";

console.log(FRONTEND_URL);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("connected"))
  .catch((err) => console.log("error to connect MongoDB", err));

const __dirname = path.resolve();

const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.use("/api", userRouter);
app.use("/api", eventRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/admin", adminEventRouter);

app.use(authenticateToken);
app.use("/api", paymentRouter);
app.use("/api", ticketRouter);

app.listen(5000, () => {
  console.log(`server listen`);
});

export default app;
