# Comprehensive Backend for Online Food Delivery Application

## Description

This project is a comprehensive backend for an online food order-delivery application, featuring over 45 API endpoints. It is organized into five main modules: Admin, Vendor, Customer, Shopping, and Delivery User, each managing a specific aspect of the application.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [API Documentation](#api-documentation)
5. [Configuration](#configuration)
6. [Deployment](#deployment)
7. [Contribution](#contribution)
8. [Contact](#contact)

## Features

### Admin
- Create Vendor
- Get Vendors 
- Get Transactions
- Get Delivery Users
- Verify Delivery Users

### Vendor
- Register
- Login
- Update Profile, images, service availability
- Add and Get Foods
- Get Orders and process them
- Add Offers, and edit them

### Shopping
- Get Food Availability
- Get Top Restaurants
- Get Offers
- Search Foods
- Get Food Under 30 Minutes

### Customer
- Register
- Login
- OTP Verification
- Update Profile
- Add to Cart, Get and delete Cart
- Apply Offer
- Place Order
- Get Orders

### Delivery User
- Register
- Login
- Update Profile
- Change Status


## Installation

This project is built using Node.js, Express, and TypeScript. To get started, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/Deval1807/Food-Order-Backend
    cd Food-Order-Backend
    ```

2. Install the dependencies:
    ```bash
    npm install
    ```

3. Start the project in development:
    ```bash
    npm run dev
    ```

## Usage

Once the server is running, you can access the API endpoints using a tool like Postman or via your frontend application. The API documentation provides detailed information on each endpoint, including the request and response formats.

## API Documentation

For detailed API documentation, please visit [API Documentation](#)

## Configuration

Ensure you have the following environment variables set up in your `.env` file:

```plaintext
PORT = <your-port>

MONGO_URI = <your-URI>

APP_SECRET = <your-secret-key>

TWILIO_SID = <your-twilio-sid>
TWILIO_AUTH_TOKEN = <your-twilio-auth-token>
TWILIO_PHONE_NUMBER = <your-twilio-phone-number>
```

## Deployement

To deploy the application, follow these steps:

1. Build the project
    - If you have executed ```npm install```, It will also build your project.
    - You can find the build int 'dist' directory
    - If you want to build your project again, execute
    ```bash
    npm run build
    ```

2. Start the built project
    ```bash
    npm start
    ```


## Contribution

We welcome contributions from the community. To contribute, please fork the repository, create a new branch, and submit a pull request. Make sure to follow the coding standards and ethical practices. 


## Contact

For questions or support, please contact Deval Darji by following ways:

1. LinkedIn: [Deval Darji](https://www.linkedin.com/in/deval-darji-a15002226/)

2. Email: [deval135darji@gmail.com](mailto:deval135darji@gmail.com)