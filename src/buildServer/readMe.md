# Build Server

The **Build Server** handles the build process of user projects in a project hosting platform. It takes care of the following tasks when a user pushes their code:

- Clones the project repository from GitHub, GitLab, or other version control systems.
- Installs dependencies (e.g., `npm install`, `yarn install` for JavaScript projects).
- Builds the project using appropriate build tools (e.g., Webpack, Next.js build).
- Outputs the build in the desired format (static files, serverless functions, Docker images, etc.).

This server is designed to handle resource-intensive tasks, such as compiling, building, and optimizing the build output.

## AWS Services Used

The Build Server uses various AWS services to manage and optimize the build process:

- **ECS/Fargate**: Deploys containerized services (build environments) to ensure scalable and efficient execution.
- **ECR (Elastic Container Registry)**: Stores Docker images for the build process.
- **S3 (Simple Storage Service)**: Stores static build files (HTML, CSS, JS) or build artifacts.
- **Lambda**: Executes serverless build tasks for specific use cases where running a serverless function is more efficient.
- **SQS/SNS**: Notifies the API Server when the build process is complete, triggering the next action.

## Folder Structure

The Build Server is organized in the following structure under the `src/buildServer` directory:


### Handlers
Contains the logic for handling different types of builds based on the user's project technology stack. For example, handling Node.js, Python, static websites, etc.

### Routes
Defines the API endpoints that interact with the Build Server. This includes routes for:
- Triggering a build process
- Monitoring the build status
- Fetching logs and results of the build process

### Utils
Holds the helper functions for:
- Cloning repositories from version control systems (GitHub, GitLab, etc.)
- Running build commands (install dependencies, build the project)
- Error handling and reporting

