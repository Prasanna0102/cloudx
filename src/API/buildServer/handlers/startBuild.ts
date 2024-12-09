import {
  runCommand,
  isValidBranch,
  isValidGitUrl,
  logBuildStep,
  updateBuildStatus,
} from "../utils/buildUtils";
import { runBuildCommand } from "./runBuildCommand";
import { uploadFilestoS3 } from "../utils/uploadtoS3";
import { cleanOldBuilds, ensureDirectory } from "../utils/ensureDirectory";
import { createProjectEntry } from "../utils/createProjectEntry";

export async function startBuild(
  projectId: string,
  gitUrl: string,
  branch: string
) {
  // Step 1: Validate Input
  if (!isValidGitUrl(gitUrl)) {
    logBuildStep(projectId, "Validation", "Invalid Git URL", true);
    return updateBuildStatus(projectId, "Failed");
  }

  if (!isValidBranch(branch)) {
    logBuildStep(projectId, "Validation", "Invalid Branch Input", true);
    return updateBuildStatus(projectId, "Failed");
  }

  const buildDirectory = `/builds/${projectId}`;

  try {
    await createProjectEntry(projectId, gitUrl, branch, "Pending");
    logBuildStep(projectId, "Setup", "Project entry created in database");
  } catch (error: Error | any) {
    logBuildStep(
      projectId,
      "Setup",
      `Failed to create project entry in database: ${error.message}`,
      true
    );
    return updateBuildStatus(projectId, "Failed");
  }

  // Step 2: Prepare Build Directory
  try {
    await ensureDirectory(buildDirectory);
    logBuildStep(projectId, "Setup", "Build directory prepared");
  } catch (error: Error | any) {
    logBuildStep(projectId, "Setup", `Failed to create build directory: ${error.message}`, true);
    return updateBuildStatus(projectId, "Failed");
  }

  // Step 3: Clone Repository
  try {
    logBuildStep(projectId, "Git Clone", `Cloning repository from ${gitUrl}`);
    await runCommand(`git clone ${gitUrl} .`, buildDirectory);
    await runCommand(`git checkout ${branch}`, buildDirectory);
    logBuildStep(projectId, "Git Clone", "Repository cloned successfully");
  } catch (error: Error | any) {
    logBuildStep(
      projectId,
      "Git Clone",
      `Failed to clone repository: ${error.message}`,
      true
    );
    await cleanOldBuilds(buildDirectory);
    return updateBuildStatus(projectId, "Failed");
  }

  // Step 4: Upload Files to S3
  try {
    logBuildStep(projectId, "Upload", "Uploading files to S3...");
    await uploadFilestoS3(projectId);
    logBuildStep(projectId, "Upload", "Files uploaded to S3 successfully");
  } catch (error: Error | any) {
    logBuildStep(
      projectId,
      "Upload",
      `Failed to upload files to S3: ${error.message}`,
      true
    );
    await ensureDirectory(buildDirectory);
    return updateBuildStatus(projectId, "Failed");
  }

  // Step 5: Start Build Process
  updateBuildStatus(projectId, "InProgress");

  try {
    logBuildStep(projectId, "Build", "Starting build process...");
    await runBuildCommand(projectId);
    logBuildStep(projectId, "Build", "Build completed successfully");
    updateBuildStatus(projectId, "Completed");
  } catch (error: Error | any) {
    logBuildStep(
      projectId,
      "Build",
      `Build process failed: ${error.message}`,
      true
    );
    updateBuildStatus(projectId, "Failed");
    await cleanOldBuilds(buildDirectory);
    return;
  }

  // Step 6: Cleanup
  try {
    await cleanOldBuilds(buildDirectory);
    logBuildStep(projectId, "Cleanup", "Build directory cleaned up");
  } catch (error: Error | any) {
    logBuildStep(projectId, "Cleanup", `Failed to clean up build directory: ${error.message}`, true);
  }

  return updateBuildStatus(projectId, "Completed");
}
