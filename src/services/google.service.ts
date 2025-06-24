import axios from "axios";

function extractFileId(url: string): string {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  throw new Error("Invalid Google Drive URL");
}

export const downloadFile = async (url: string) => {
  const fileId = extractFileId(url);
  const response = await axios.get(
    `https://drive.google.com/uc?export=download&id=${fileId}`,
    {
      responseType: "stream",
    }
  );

  const contentDisposition = response.headers["content-disposition"];
  let filename = `${Date.now()}`;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="(.+)"/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  return { stream: response.data, filename };
};
