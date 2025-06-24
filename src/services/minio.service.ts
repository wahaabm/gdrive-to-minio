import { Client } from "minio";
import * as dotenv from "dotenv";
import mime from "mime-types";

dotenv.config();

const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT!),
  useSSL: process.env.MINIO_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const uploadToMinio = async (stream: any, filename: string) => {
  const contentType = mime.lookup(filename) || undefined;
  await minioClient.putObject(
    process.env.MINIO_BUCKET!,
    filename,
    stream,
    undefined,
    contentType ? { "Content-Type": contentType } : undefined
  );
  return `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET}/${filename}`;
};
