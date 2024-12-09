import { NextApiRequest, NextApiResponse } from "next";
import { Project } from "@/types/types";
import { prisma } from "../../../../prisma/prismaClient";

export async function createNewProject(
  data: Project,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, gitUrl, userId } = req.body;

  if (!name || !gitUrl || !userId) {
    return res
      .status(400)
      .json({ error: "Missing required fields: name, gitUrl, userId" });
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        userId,
        name,
        gitUrl,
        status: "Created",
        saveCount: 0,
      },
    });
    console.log(`Project created with project id ${data.id}`);
    return res
      .status(201)
      .json({ message: "Project created successully", project: newProject });
  } catch (error) {
    console.log(`${error}`);
    return res.status(500).json({ message: "Failed to created project" });
  }
}

