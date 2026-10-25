import "server-only";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
