# Meeting Management API

This Node.js application is a Meeting Management API that allows users to manage their meetings and tasks efficiently. It provides endpoints for creating, retrieving, updating, and summarizing meetings, as well as viewing associated tasks. The application is designed to be run locally or within a Docker container with a MongoDB database.

## Purpose
The Meeting Management API enables users to organize meetings, track action items, and maintain records of discussions. It is built with endpoints for CRUD operations on meetings and tasks, along with a bonus dashboard endpoint to provide a high-level summary.

## Endpoints

### Meetings Endpoints

- **`GET /api/meetings`**  
  Retrieves all meetings for the authenticated user, providing an overview of scheduled events.

- **`POST /api/meetings`**  
  Creates a new meeting with details such as title, date, and participants.

- **`GET /api/meetings/:id`**  
  Retrieves a specific meeting by its ID, including any associated tasks.

- **`PUT /api/meetings/:id/transcript`**  
  Updates a meeting's transcript, adding a detailed record of discussions.

- **`POST /api/meetings/:id/summarize`**  
  Generates a summary and action items for a specific meeting using a mock AI service. After the summary and action items are generated, tasks related to the meeting are automatically created.

- **`GET /api/meetings/stats`**  
  Returns statistics about meetings, including:
  - Total number of meetings
  - Average number of participants
  - Most frequent participants

### Tasks Endpoints

- **`GET /api/tasks`**  
  Returns all tasks assigned to the authenticated user.

### Dashboard Endpoint (Bonus)

- **`GET /api/dashboard`**  
  Provides a summary of the user’s meetings, including:
  - Total number of meetings and upcoming meetings
  - Task counts categorized by status (e.g., pending, in-progress, completed)
  - Count of past due tasks

## Running the Project

You can run this application locally or using Docker. Below are instructions for both methods.

### Prerequisites
- **Node.js v22**: Make sure to have Node.js version 22 installed if running locally.
- **Docker and Docker Compose**: Ensure Docker is installed and running on your machine.

### Running Locally

1. **Clone the Repository**  
	```bash
	git clone <repository-url>
	cd <repository-folder>
	```
2. **Install Dependencies**
	```bash
	npm install
	```
3. **Run MongoDB**

	If you are running MongoDB locally, start the database.
4. **Seed the Database**

	After MongoDB is running, seed the database with initial data:
	```bash
	npm run seed
	```
5. **Start the Server**
	```bash
	npm start
	```
6. Access the API

	Visit http://localhost:3000 to start making requests to the API.

### Running with Docker
1. **Clone the Repository**  
	
	```bash
	git clone <repository-url>
	cd <repository-folder>
	```
2. **Run Docker Compose**
	
	```bash
	npm run docker:up
	```
3. **Seed the Database**
	
	After Docker Compose runs both the MongoDB and Node.js server, seed the database with initial data:
	```bash
	npm run seed
	```
4. **Access the API**

	Visit http://localhost:3000 to start making requests to the API.

## Making API Requests
After starting the server, you can interact with the API endpoints. Here are some example commands using curl:

- **Get all meetings**:
```bash
curl http://localhost:3000/api/meetings
```
- **Create a new meeting**:
```bash
curl -X POST http://localhost:3000/api/meetings 
-H "Content-Type: application/json" 
-H "Authorization: Bearer <jwt-token>" 
-d '{
    "title": "Fireflies Test",
    "date": "2024-11-06T08:00:00Z",
    "participants": ["Guilherme", "Dionatan", "Andrei"]
	}'
```

### Getting authenticated

Most endpoints are protected with Json Web Tokens which decrypts a token to get the user id making the request.
To create a new token for your API requests, you can run the `generate-jwt` script:
```bash
npm run generate:jwt
```
1. Copy the generated code
2. Add the token in the Authorization Header with the Bearer prefix, e.g.: 
```bash
-H "Authorization: Bearer <jwt-token>"
```

## Environment Variables
The application uses environment variables for configuration. You can define these in a [.env](./.env.example) file in the project root using [.env.example](./.env.example) as a reference of the available envs.

# TODO

This is an exaustive list of features to implement into the application to make it more robust:

### Documentation

- Add automated API documentation with OpenAPI or Swagger
- Serve documentation into a public view

### Quality Assurance

- Add 100% unit/integration testing coverage
- Add E2E tests for user workflows (e.g., a user seeing a dashboard)
- Add testing coverage rules for CI
- Benchmark modules with tools like `autocannon` or `K6`

### Observability/Performance

- Implement better caching strategies with in-memory caching or external services (e.g., Redis)
- Collect Service-level Indicators (SLIs), including:
	- Distributed tracing
	- API latency
  - Request counts
  - Memory usage
- Add Health and Uptime check endpoints  
- Apply log segmentation (e.g., audit logs, general logs)  

### Security

- Add support for OAuth2 authentication (e.g., Google, Facebook)
- Add refresh JWT token handling
- Implement dynamic rate-limiting for endpoints
- Add local HTTPS support via Docker
- Redact sensitive data in logs and API responses

### Business Features

- Add Multi-Tenancy support for multiple databases and environments
- Include example UI view
- Include A/B testing tools for feature-flagging
- Implement API versioning for routes
- Include internationalization for clocking setup and human-readable errors
- Add deployment workflows for common providers, such as:
  - AWS
  - Google Cloud
  - Azure
  - Vercel
  - Railway
  - Heroku
