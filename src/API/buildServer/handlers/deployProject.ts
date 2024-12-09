import { DeploymentStatus } from "@prisma/client";
import {
  logBuildStep,
  runCommand,
  updateBuildStatus,
} from "../utils/buildUtils";
import { cleanOldBuilds, ensureDirectory } from "../utils/ensureDirectory";

function updateDeploymentStatus(projectId: string, status: DeploymentStatus) {
  console.log(`Deployed ${projectId} status updated to: ${status}`);
}

export async function deployProject(projectId: string) {
  const deployDir = `/deployments/${projectId}`;
  await ensureDirectory(deployDir);

  try {
    await runCommand(`cp -R /builds/${projectId}/build/* ${deployDir}`, "");
    logBuildStep(
      projectId,
      "Deploying the project",
      `Project ${projectId} deployed successfully`
    );
  } catch (error: Error | any) {
    logBuildStep(
      projectId,
      "Deploying Project",
      `Deployment failed: ${error.message}`,
      true
    );
    updateBuildStatus(projectId, DeploymentStatus.Failed);
    return;
  }

  // Use the status from the enum here
  updateDeploymentStatus(projectId, DeploymentStatus.Completed);
}

export async function cleanBuilds(projectId: string) {
  const buildDir = `/builds/${projectId}`;
  const deployDir = `/deployments/${projectId}`;

  // Clean both directories
  await cleanOldBuilds(buildDir);
  await cleanOldBuilds(deployDir);

  logBuildStep(projectId, "Cleaning up", "Old builds cleaned up successfully");
}
