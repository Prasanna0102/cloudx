import { exec } from "child_process";
import { prisma } from "../../../../prisma/prismaClient";
import { Prisma } from "@prisma/client";

// Validates Git URLs
export function isValidGitUrl(url: string): boolean {
  const gitUrlRegex =
    /^(https:\/\/|git@)([\w.-]+)(:\d+)?\/([\w-]+)\/([\w.-]+)(\.git)?$/i;
  return gitUrlRegex.test(url);
}

// Validates Branch Names
export function isValidBranch(branchName: string): boolean {
  return /^[a-zA-Z][a-zA-Z0-9._-]*$/.test(branchName); // Must start with a letter
}

// Logs build steps with additional context
export function logBuildStep(
  projectId: string,
  step: string,
  message: string,
  isError = false,
  meta?: Record<string, unknown> // Optional metadata for debugging
) {
  const logLevel = isError ? "ERROR" : "INFO";
  console.log(
    `[${new Date().toISOString()}][${logLevel}][Project ${projectId}] ${step} - ${message}`,
    meta ? `Metadata: ${JSON.stringify(meta)}` : ""
  );
}

// Loads an environment variable or throws an error
export function loadEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is missing`);
  }
  return value;
}

// Enum for Build Status
export const BuildTaskStatus = {
  Queued: "Queued",
  InProgress: "InProgress",
  Completed: "Completed",
  Failed: "Failed",
  Cancelled: "Cancelled",
  TimedOut: "TimedOut",
  Retrying: "Retrying",
} as const;

type BuildTaskStatus = typeof BuildTaskStatus[keyof typeof BuildTaskStatus];

export async function updateBuildStatus(
  projectId: string,
  status: BuildTaskStatus | undefined
) {
  try {
    await prisma.buildTask.update({
      where: { id: projectId },
      data: {
        status: status as Prisma.EnumBuildTaskStatusFieldUpdateOperationsInput,
      },
    });
    console.log(`Build ${projectId} status updated to: ${status}`);
  } catch (error) {
    console.error(`Failed to update status for Build ${projectId}:`, error);
    throw error;
  }
}

// Executes shell commands in a specified directory
export function runCommand(command: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        reject(`Command failed: ${stderr || stdout || error.message}`);
      } else {
        resolve(stdout);
      }
    });
  });
}
