# B2B RFQ Marketplace

A mini B2B Request for Quotation (RFQ) Marketplace that connects buyers and suppliers.

## Project Overview

Buyers can post product or service requirements, and suppliers can browse RFQs and submit quotations.

## Features

### Buyer Features
- User registration and login
- Create RFQs
- Edit and delete RFQs
- View submitted RFQs
- View supplier quotations
- Accept or reject quotations

### Supplier Features
- User registration and login
- Browse available RFQs
- Search and filter RFQs
- Submit quotations
- View submitted quotations

## Technology Stack

### Frontend
- React.js
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt

### Database
- MySQL

### Deployment
- Vercel (Frontend)
- Render (Backend)

## Project Structure

B2B-RFQ-Marketplace/
├── frontend/
└── backend/

## Architecture

The frontend is developed using React.js and communicates with the backend through REST APIs using Axios.

The backend is developed using Node.js and Express.js. MySQL is used for persistent data storage. JWT authentication is used to authenticate users, and role-based authorization separates buyer and supplier functionality.

## Installation and Setup

### Clone the Repository

git clone https://github.com/himaja44/B2B-RFQ-Marketplace.git

### Frontend Setup

cd frontend
npm install
npm run dev

### Backend Setup

cd backend
npm install
node server.js

Configure the required environment variables before running the backend.

## Live Application

Frontend:
[Add your Vercel frontend URL]

Backend:
https://b2b-rfq-marketplace-o5oa.onrender.com

## GitHub Repository

https://github.com/himaja44/B2B-RFQ-Marketplace

## Assumptions and Limitations

- Users register either as buyers or suppliers.
- Authentication is handled using JWT.
- The application requires a configured MySQL database.
- The deployed application may have limitations related to hosting and database configuration.

## Author

Himaja