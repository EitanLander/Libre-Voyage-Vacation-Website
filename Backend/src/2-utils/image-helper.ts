import { UploadedFile } from "express-fileupload";
import path from "path";
import { v4 as uuid } from "uuid";
import fsPromises from "fs/promises";

// Save image to disk in a uuid name:
async function saveImage(photo: UploadedFile): Promise<string> {
  // // If no image sent:
  if (!photo) return "no-image.png";

  // Take original file extension:
  const extension = photo.name.substring(photo.name.lastIndexOf("."));

  // Create unique file name:
  const fileName = uuid() + extension; // same as guid

  // Get absolute path to save image:
  const absolutePath = path.join(__dirname, "..", "1-assets", "images", fileName);

  // Save image:
  await photo.mv(absolutePath);

  // Return unique name:
  return fileName;
}

// Update image:
async function updateImage(image: UploadedFile, oldImage: string): Promise<string> {
  // Remove old image:
  await deleteImage(oldImage);

  // Save new image:
  const fileName = await saveImage(image);

  // Return new image name:
  return fileName;
}

// Delete image:
async function deleteImage(oldImage: string): Promise<void> {
  try {
    if (!oldImage) return;

    // Get absolute path to save image:
    const absolutePath = path.join(__dirname, "..", "1-assets", "images", oldImage);

    // Remove image:
    await fsPromises.rm(absolutePath);
  } catch (err: any) {
    console.log(err.message);
  }
}

export default {
  saveImage,
  updateImage,
  deleteImage,
};
