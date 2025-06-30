import * as express from "express";
import { type Request, type Response } from "express";
import { downloadFile } from "../services/google.service.js";
import { uploadToMinio, deleteFile } from "../services/minio.service.js";
import * as cron from "node-cron";
import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  console.log("Req came");
  try {
    const { gdriveUrl } = req.body;
    if (!gdriveUrl) {
      res.status(400).json({ error: "gdriveUrl is required" });
      return;
    }
    const { stream, filename } = await downloadFile(gdriveUrl);
    const objectUrl = await uploadToMinio(stream, filename);
    res.status(201).json({ objectUrl });

    // Schedule file deletion
    const deletionDelay = parseInt(process.env.FILE_DELETION_DELAY || "86400"); // Default 24 hours
    const objectName = objectUrl.split("/").pop()!;
    setTimeout(async () => {
      try {
        await deleteFile(objectName);
      } catch (error) {
        console.error(`Failed to delete file ${objectName}:`, error);
      }
    }, deletionDelay * 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "File processing failed" });
  }
});

export default router;
