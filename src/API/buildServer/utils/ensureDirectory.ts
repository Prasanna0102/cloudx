import fs from "fs/promises";

export async function ensureDirectory(path: string) {
  try {
    await fs.mkdir(path, { recursive: true });
    console.log(`Directory created: ${path}`);
  } catch (err:Error|any) {
    console.error(`Failed to create directory: ${err.message}`);
  }
}

export async function cleanOldBuilds(path: string) {
  try {
    await fs.rm(path, { recursive: true, force: true });
    console.log(`Cleaned old builds at: ${path}`);
  } catch (err:Error | any) {
    console.error(`Failed to clean directory: ${err.message}`);
  }
}
