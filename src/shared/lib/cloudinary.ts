import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// https://res.cloudinary.com/<cloud>/image/upload/v123/portfolio/abc.png -> portfolio/abc
function getPublicId(url: string): string | null {
  if (!url.startsWith("https://res.cloudinary.com/")) return null;
  const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z0-9]+$/i);
  return match ? match[1] : null;
}

export async function deleteImages(urls: string[]): Promise<void> {
  const publicIds = urls
    .map(getPublicId)
    .filter((id): id is string => id !== null);
  if (publicIds.length === 0) return;
  await cloudinary.api.delete_resources(publicIds);
}

export async function uploadImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "portfolio" }, (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Пустой ответ от Cloudinary"));
        }
        resolve(result.secure_url);
      })
      .end(buffer);
  });
}
