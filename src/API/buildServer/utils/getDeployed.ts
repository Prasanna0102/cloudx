import { prisma } from "../../../../prisma/prismaClient";


export async function getLastSuccessfulDeployment(projectId:string) {
    try {
        const lastdeployment = await prisma.deployment.findFirst({
            where:{
                projectId,
                status:"COMPLETED"
            },
            orderBy:{
                createdAt:'desc'
            }
        })

        return lastdeployment
    } catch (error) {
        console.log(`Error fetching last deployment: ${error}`)
        return null
    }
}