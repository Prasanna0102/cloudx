import { prisma } from "../../../../prisma/prismaClient";
import {
  logBuildStep,
  runCommand,
  updateBuildStatus,
} from "../utils/buildUtils";
import { getLastSuccessfulDeployment } from "../utils/getDeployed";

export async function rollbackDeployment(projectId: string) {
  const lastSuccessfullDeployment = await getLastSuccessfulDeployment(
    projectId
  );

  if (!lastSuccessfullDeployment) {
    logBuildStep(
      projectId,
      "Rollback",
      "No Successfull deplyment founds to roll back to"
    );
    return updateBuildStatus(projectId, "Failed");
  }

  const deployDir = `/deployments/${projectId}`;
  const lastDeployDir = `/deployments/${lastSuccessfullDeployment.id}`;

  logBuildStep(
    projectId,
    "Rollback",
    `Rolling back to deployment ${lastSuccessfullDeployment.id}...`
  );

  try {
    await runCommand(`cp -R ${lastDeployDir}/* ${deployDir}`, "");
    logBuildStep(
      projectId,
      "Rollback",
      `Files restored successfully from ${lastSuccessfullDeployment.id}`
    );

    await prisma.deployment.update({
      where: { id: lastSuccessfullDeployment.id },
      data: { status: "RolledBack" },
    });

    updateBuildStatus(projectId, "Completed");

    logBuildStep(projectId, "Rollback", "Rollback compledted successfully");

    return { success: true, message: "Rollback completed successfully" };
  } catch (error) {
    logBuildStep(
      projectId,
      "Rollback",
      `Failed to rollback deployment: ${error}`,
      true
    );
    return { success: false, message: `Rollback failed: ${error}` };
  }
}
