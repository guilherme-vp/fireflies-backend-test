# Project Structure

This document outlines the purpose of each directory in the project structure. The project is organized to support clean separation of concerns and scalability.

## Directory Breakdown

### **Config layer**

Contains configuration files for the application. 
This includes environment settings, database configurations, and any global settings used across the application.

#### Rules

1. Always define your settings in their respective scope file, e.g.: caching is part of the database scope, mailing is part of the notification scope, OpenAI API Keys and models are part of the AI scope.
2. All layers may import config layer

### **Constants layer**

Contains constant values, enums, and shared configuration values used across the application. This helps avoid hardcoding and ensures consistency across different parts of the application.

#### Rules

1. Constants should be organized logically based on their usage (e.g., error codes, status enums, system limits).
2. All layers may import the constants layer, but avoid importing other layers into the constants layer.
3. Constants should be defined with descriptive names to keep the readability as constants, i.e.: UPPER_SNAKED_CASE.
4. If a constant represents a configuration setting that can change (e.g., a feature flag), it should be placed in the config layer instead.
5. Group related constants together in files or subdirectories, e.g., HTTP status codes in one file, user roles in another.

### **Database layer**

Manages multiple database connections, initialization logic, configurations, and interactions with any database.

#### Rules

1. Configuration for the database (such as connection strings, pool size, etc.) should be kept in the config layer, and imported into the database layer.
2. Avoid using database connections directly in other layers. Instead, use the Repositories' layers abstractions to interact with the database.
3. If you need to interact with multiple databases (e.g.: MongoDB, Redis, PostgreSQL), keep the logic and connections isolated from each other.

### **Errors layer**
Handles error definitions, error handling utilities, and custom error types used throughout the application. This layer is responsible for providing consistent error messages and structures, making it easier to handle and respond to errors across various layers.

#### Rules

1. Define custom error classes extending the base Module Error for different error types (e.g., `NotFoundError`, `ValidationError`, `DatabaseError`) to allow for better error categorization and handling.
2. Errors should aways extend the base [Module Error](../src/errors/module-error.error.ts) ensuring they can be handled as an application error, not as unexpected exceptions.
3. Errors should include meaningful messages and, when necessary, additional information (e.g., error codes, request context) to aid in debugging and troubleshooting.
4. All errors are captured and handled in a centralized way, such as through middleware or global error handlers, to ensure consistent responses across the application.
5. Only the application and infrastructure layers should import error classes from this layer. Other layers should rely on them for error handling.
6. Ensure error handling is consistent across all layers, with meaningful HTTP status codes (e.g., `404 Not Found`, `400 Bad Request`, `500 Internal Server Error`) and structured responses. Use the [HTTP Status](../src/constants/http-status.constant.ts) constant and [Error Code](../src/errors/error-code.enum.ts) enum to declare the internal and HTTP status codes for the error.

### **middlewares**
Contains middleware functions that are used to intercept and modify requests or responses at various stages of the application's request-response cycle. These middlewares are typically responsible for tasks such as authentication, authorization, logging, input validation, and error handling.

#### Rules

1. Middlewares should be modular and focused on a single responsibility (e.g., authentication middleware, validation middleware). Avoid creating "catch-all" middlewares that handle multiple unrelated concerns.
2. All middlewares should be generic and reusable across different routes and controllers. They should not contain business logic but should act as handlers for common tasks.
3. Only the `routes` or `controllers` layers should import middlewares, and they should be responsible for applying them to the appropriate routes.

### **modules**
This directory is structured by feature or functionality of the application, making it easy to maintain and extend. Each module represents a specific domain in the application. Examples include:

1. Each module should be self-contained, meaning it should encapsulate all necessary logic related to a specific feature or domain. A module should not depend on other modules unless absolutely necessary, and in such cases, dependencies should be minimal and well-defined.
2. Every module should consist of the following components:
   - **Models**: Define the structure and behavior of the data entities within the module. Models interact directly with the database and encapsulate data validation, transformation, and interaction logic.
   - **Schemas**: Define the validation schema structure (if using a validation library such as Zod or Yup). These schemas are responsible for validating and structuring data that gets persisted to the database or traffegated through external services.
   - **Controller**: Handles incoming requests and responses. The controller is responsible for interacting with services to process the logic and return the appropriate responses.
   - **Repository**: Manages the direct interaction with the data layer (e.g., querying the database). It abstracts away database-specific logic and provides a clean interface for the service layer to access data.
   - **Service**: Contains the business logic of the module. Services typically interact with repositories or other services to retrieve and manipulate data, and then apply any necessary business rules.
   - **Router**: Defines the API endpoints for the module and binds all repositories, services and controllers to their respective routes. The router serves as the entry point for HTTP requests related to the module and a factory for injectable services.
3. Modules should be kept small and focused on a single responsibility. If a module becomes too large or complex, consider breaking it down into smaller sub-modules or using other design patterns like the "Strategy" or "Observer" pattern.
4. The components of each module should follow clear naming conventions to make it easy to understand the responsibility of each file. For example:
   - **models**: Data structures and Mongoose models.
   - **schemas**: Zod schemas for data validation.
   - **<module>.controller.ts**: Request handling and controller logic.
   - **<module>.repository.ts**: Data access and queries.
   - **<module>.service.ts**: Business logic and core functionality.
   - **<module>.router.ts**: API routing, Classes initializations, and HTTP endpoint definitions.
5. Avoid tight coupling between modules. A module should not directly depend on or modify the internal state of another module. Communication between modules should be done through well-defined interfaces such as **Services**.
7. If a module interacts with external services (e.g., third-party APIs), define these integrations within the **service** layer or a dedicated sub-module to keep the core module logic clean and focused.

### **scripts**
Contains various utility scripts used for tasks such as database seeding, migrations, and data processing. These are typically one-off scripts used to manage or manipulate data.

#### Rules

1. Scripts should not depend on the core business logic of the application. They may interact with the database or services, but the core logic should be independent of the scripts layer.
2. Scripts should be executable from the command line, typically using a `REPL`, `node` or `tsx`.
3. Scripts should never be imported.

### **services**
This layer handles the core business logic and external service interactions. It acts as a façade for an external system or resource, e.g. OpenAI, JWT, Twillio.

This is sometimes called a [Gateway](https://martinfowler.com/eaaCatalog/gateway.html).

#### Rules

1. Each service should have a single responsibility. If it handles multiple tasks, consider breaking it into smaller services.
2. Services should only be imported by modules, middlewares or scripts.
3. A service module should encapsulate (hide) the transport layer & data representation layer of the resource


### **types**
Defines TypeScript types, interfaces, and type declarations used across the application to ensure type safety and consistency.

### **utils**
Contains utility functions that can be used across different parts of the application. These functions are typically small, reusable, and independent of the rest of the application logic.