# Wallet Application

## Overview

The Wallet Application is a web-based financial management tool that allows users to manage their accounts, transactions, budgets, and reports. The application provides a user-friendly interface to track financial activities and generate insightful reports.

## Features

- **User Authentication**: Secure login and registration with JWT-based authentication.
- **Account Management**: Create, view, and manage multiple financial accounts.
- **Transaction Tracking**: Record and categorize income and expenses.
- **Budgeting**: Set and monitor budgets for different categories.
- **Reporting**: Generate reports to analyze financial data.
- **Notifications**: Receive notifications for important financial updates.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/).
- **npm**: Node.js package manager, which is included with Node.js.
- **Docker**: Install Docker from [docker.com](https://www.docker.com/).
- **Docker Compose**: Install Docker Compose from [docker.com](https://www.docker.com/).

## Getting Started

### Backend Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/wallet-application.git
   cd wallet-application/server

   ```

2. **Create a Docker network:**
   docker network create wallet-network

3. **Set up environment variables: Create a .env file in the server directory and add the following:**
   DATABASE_URL="postgresql://username:password@localhost:5432/wallet"
   JWT_SECRET="your_jwt_secret"

4. **Build and run the Docker container:**
   docker-compose up --build

### Frontend Setup

1. **Navigate to the client directory:**
   cd ../client

2. **Install dependencies:**
   npm install

3. **Set up environment variables: Create a .env file in the client directory and add the following:**
   REACT_APP_API_URL="http://localhost:5000/api"

4. **Start the client:**
   npm start

## Running the Application

1. **Backend**: The backend server will run on http://localhost:5000.
2. **Frontend**: The frontend application will run on http://localhost:5173.

## Public Preview

You can access a publicly accessible preview of the application at .

## Project Structure

wallet-application/
├── client/ # React frontend
│ ├── public/ # Public assets
│ ├── src/ # Source files
│ │ ├── components/ # React components
│ │ ├── contexts/ # Context providers
│ │ ├── hooks/ # Custom hooks
│ │ ├── lib/ # Utility functions and API calls
│ │ ├── pages/ # Page components
│ │ ├── App.tsx # Main App component
│ │ ├── index.tsx # Entry point
│ └── package.json # Frontend dependencies and scripts
├── server/ # Express backend
│ ├── prisma/ # Prisma schema and migrations
│ ├── src/ # Source files
│ │ ├── controllers/ # Route controllers
│ │ ├── middleware/ # Middleware functions
│ │ ├── models/ # Database models
│ │ ├── routes/ # Express routes
│ │ ├── app.ts # Express app setup
│ │ ├── server.ts # Server entry point
│ └── package.json # Backend dependencies and scripts
└── README.md # Project documentation

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Make your changes.
4. Commit your changes (git commit -m 'Add some feature').
5. Push to the branch (git push origin feature/your-feature).
6. Open a pull request.

## Contact

If you have any questions or suggestions, feel free to reach out to us at wilsondev26@gmail.com.
