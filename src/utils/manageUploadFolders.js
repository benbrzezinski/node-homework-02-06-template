import fs from "fs/promises";
import path from "path";

export const uploadDir = path.join(process.cwd(), "tmp");
export const storeAvatars = path.join(process.cwd(), "public", "avatars");

const isAccessible = async path => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

const createFolderIfNotExists = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder, { recursive: true });
  }
};

export const initFolders = async () => {
  try {
    await createFolderIfNotExists(uploadDir);
    await createFolderIfNotExists(storeAvatars);
  } catch (err) {
    console.error(err.message);
  }
};
