# API Server

The **API Server** serves as the interface for users to interact with the project hosting platform. It provides RESTful API endpoints for managing project deployments, monitoring build progress, and handling user requests.

### Key Features

- **Deploy a Project**: Trigger the build process, monitor its progress, and retrieve the results.
- **Manage Projects**: Start, stop, or manage deployed services.
- **Monitor Builds**: Fetch the status of ongoing or completed builds and retrieve logs or results.

The API Server is designed to facilitate interactions with the Build Server, manage projects, and handle requests from users through a secure and scalable API.

## AWS Services Used

The API Server relies on several AWS services for performance, scalability, and monitoring:

- **API Gateway**: Exposes the REST API to the users, handling incoming requests and routing them to the appropriate Lambda functions.
- **Lambda**: Handles stateless tasks like managing user requests, interacting with the database, and triggering other AWS services.
- **DynamoDB**: Stores metadata for projects, build statuses, and other essential data.
- **CloudWatch**: Logs API requests and monitors the health of the API Server to ensure smooth operation.

## Folder Structure

The API Server is organized in the following structure under the `src/apiServer` directory:


### Routes
Defines the REST API endpoints for:
- **Deploying Projects**: Endpoint to trigger a build and monitor progress.
- **Managing Projects**: Start, stop, or configure the services.
- **Monitoring Builds**: Fetch the status, logs, and results of builds.

### Handlers
Contains the business logic for:
- Triggering builds on the Build Server
- Managing project deployments
- Fetching build statuses and logs
- Communicating with the database (DynamoDB)

### Models
Contains the data models for interacting with the database (e.g., DynamoDB), including:
- Project metadata (name, status, build details)
- Build statuses (in progress, completed, failed)
- Any other necessary project-related data

### Utils
Holds helper functions for:
- User authentication (e.g., token validation)
- Request validation (e.g., input validation)
- Error handling and logging
- Utility functions for interacting with AWS services like Lambda and DynamoDB


