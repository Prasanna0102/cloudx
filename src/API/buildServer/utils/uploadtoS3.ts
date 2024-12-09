import {S3Client, PutObjectCommand, ObjectCannedACL} from "@aws-sdk/client-s3"
import {v4 as uuidv4} from "uuid"
import { logBuildStep, runCommand } from "./buildUtils"

export async function uploadFilestoS3(projectId:string, fileName?:string) {

    const S3 = new S3Client({})
    const bucketName = process.env.S3_BUCKET_NAME
    const zipFileName =  fileName || `build-artifact-${uuidv4()}.zip`
    const key = `projects/${projectId}/${zipFileName}`
    const buildPath = `/builds/${projectId}/dist`

    const zipFilePath = `/builds/${projectId}/${zipFileName}`
    await runCommand(`zip -r ${zipFilePath} ${buildPath}`,`/builds/${projectId}`)


    //read the zip file
    const fileBuffer = require("fs").readFileSync(zipFilePath)

    //upload files to S3


    const params = {
            Bucket:bucketName,
            Key:key,
            Body:fileBuffer,
            Contenttype:"application/zip",
            ACL:ObjectCannedACL.private, //Restricts access to only admins

    }
    try {
        const command = new PutObjectCommand(params)
        const response = await S3.send(command)
        console.log("Project files uploaded successfully")
        logBuildStep(projectId, "Uploading files to S3", "Files uploaded successfully")
    } catch (error) {
        console.error("Error uploading file", error);
        logBuildStep(projectId,"Error uploading Files", `Error: ${error}`, true)
    }
}