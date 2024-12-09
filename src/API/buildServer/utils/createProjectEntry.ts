import { prisma } from "../../../../prisma/prismaClient";

export async function createProjectEntry(
  name: string,
  gitUrl: string,
  branch: string,
  userId: string,
  teamId?: string // Optional team association
) {
  try {
    const newProject = await prisma.project.create({
      data: {
        name,
        gitUrl,
        userId, // Associates the project with the user
        teamId, // Associates the project with a team if provided
        status: "Created", // Default project status
        buildLogs: {
          create: [
            {
              buildStep: "Project Creation",
              output: `Project '${name}' created successfully.`,
              isError: false,
            },
          ],
        },
      },
    });

    console.log("Project entry created successfully:", newProject);
    return newProject;
  } catch (error) {
    console.error("Error creating project entry:", error);
    throw new Error("Failed to create project entry");
  }
}
