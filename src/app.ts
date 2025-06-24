import express from "express";
import uploadRouter from "./controllers/upload.controller.js";

const app = express();
app.use(express.json());
app.use("/upload", uploadRouter);

export default app;
