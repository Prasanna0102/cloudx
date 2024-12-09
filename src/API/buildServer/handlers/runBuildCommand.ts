import { logBuildStep, runCommand, updateBuildStatus } from "../utils/buildUtils";
import { deployProject } from "./deployProject";

export async function runBuildCommand(projectId:string) {
    //install dependencies
    try {
        await runCommand(`npm install`, `/builds/${projectId}`)
        logBuildStep(projectId, "Installing dependencies", "Dependencies install successfully")
    } catch (error) {
        logBuildStep(projectId, 'Installing dependencis','Error installing dependencies', true)
        return updateBuildStatus(projectId, "Failed")
        
    }

    //run build
    try {
        await runCommand(`npm run build`, `/builds/${projectId}`)
        logBuildStep(projectId,"Build initailised","started the build process")
    } catch (error) {
        logBuildStep(projectId,`Error building project: ${projectId}`, `Failed:${error}`, true)
        return updateBuildStatus(projectId,"Failed")
    }

    return await deployProject(projectId)
}