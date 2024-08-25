# Esthetica Beauty Salon - Backend

This is the backend server for the **Esthetica Beauty Salon** web application. It is built with Node.js and Express and is responsible for handling API requests, managing data with MongoDB, and handling authentication using JSON Web Tokens (JWT).

## Live Link

https://esthetica-backend.vercel.app

## Features

- **RESTful API**: Provides endpoints for managing salon data such as services, appointments, and user information.
- **JWT Authentication**: Secure authentication using JSON Web Tokens.
- **CORS Support**: Cross-Origin Resource Sharing is enabled to allow communication between the frontend and backend.
- **Environment Configuration**: Uses `dotenv` to manage environment variables.
- **Cookie Management**: Parses and manages cookies using `cookie-parser`.

## Installation

To run this project locally, follow these steps:

### 1. Clone the Repository

git clone https://github.com/your-username/esthetica-backend.git
cd esthetica-backend

### 2. Install Dependencies
Make sure you have Node.js installed, then run:
npm install
This will install all the required dependencies.

### 3. Set Up MongoDB
Make sure you have MongoDB installed and running. Set up your MongoDB connection URI and add it to your .env file.

### 4. Configure Environment Variables
Create a .env file in the root directory and add the following:

DB_USER=your-mongodb-uri

DB_PASS=your-mongodb-pass

ACCESS_TOKEN=your-jwt-secret

Replace your-mongodb-uri with your MongoDB connection string and your-jwt-secret with a secure secret key for JWT.

### 5. Run the Development Server
Start the application by running:

npm run dev
The server will start on http://localhost:5000.

## Dependencies
This project relies on several key libraries:

cookie-parser (^1.4.6): Middleware to parse cookies attached to the client request object.

cors (^2.8.5): Middleware to enable Cross-Origin Resource Sharing (CORS).

dotenv (^16.4.5): Loads environment variables from a .env file into process.env.

express (^4.19.2): A minimal and flexible Node.js web application framework.

jsonwebtoken (^9.0.2): For creating and verifying JSON Web Tokens (JWT) used for authentication.

mongodb (^6.8.0): MongoDB driver for Node.js to connect and interact with a MongoDB database.

nodemon (^3.1.4): A tool that helps develop Node.js applications by automatically restarting the node application when file changes are detected.

## API Endpoints
The backend provides the following endpoints:


- **POST /jwt**: Generate a JWT token and set it in a cookie.
- **POST /logout**: Log out the user by clearing the JWT token.
- **GET /services**: Fetch all available salon services with optional search and sort.
- **GET /services/:id**: Fetch details of a specific salon service.
- **GET /bookings**: Fetch all bookings for the authenticated user.
- **POST /bookings**: Create a new booking.
- **PATCH /bookings/:id**: Update the status of a specific booking.
- **DELETE /bookings/:id**: Delete a specific booking.

## Usage

Once the server is running, you can use the API endpoints to manage salon data and handle user authentication. Ensure that your frontend is configured to interact with the backend by setting the correct API base URL.

## Contributing
Contributions are welcome! If you find a bug or want to add a feature, feel free to open an issue or submit a pull request.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contact
For questions or support, please contact the project maintainer at abierhoque01@gmail.com.