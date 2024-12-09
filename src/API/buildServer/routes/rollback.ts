import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../../prisma/prismaClient";
import { rollbackDeployment } from "../handlers/rollBack";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed. Use POST." });
  }

  const { projectId } = req.body; // Assuming projectId is passed in the request body.

  if (!projectId) {
    return res.status(400).json({ success: false, message: "Project ID is required." });
  }

  try {
    const projectExists = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!projectExists) {
      return res
        .status(404)
        .json({ success: false, message: `No project found with ID: ${projectId}` });
    }

    // Perform the rollback
    await rollbackDeployment(projectId);

    return res.status(200).json({
      success: true,
      message: `Rolled back successfully to the last successful deployment.`,
    });
  } catch (error) {
    console.error(`Rollback error for project ${projectId}:`, error);
    return res.status(500).json({
      success: false,
      message: `Error processing rollback request.`,
    });
  }
}
