import * as express from "express";
import { type Request, type Response } from "express";
import { downloadFile } from "../services/google.service.js";
import { uploadToMinio } from "../services/minio.service.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { gdriveUrl } = req.body;
    if (!gdriveUrl) {
      res.status(400).json({ error: "gdriveUrl is required" });
      return;
    }
    const { stream, filename } = await downloadFile(gdriveUrl);
    const objectUrl = await uploadToMinio(stream, filename);
    res.status(201).json({ objectUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File processing failed" });
  }
});

export default router;
