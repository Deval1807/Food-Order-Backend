# Comprehensive Backend for Online Food Delivery Application

## Description

This project is a comprehensive backend for an online food order-delivery application, featuring over 45 API endpoints. It is organized into five main modules: Admin, Vendor, Customer, Shopping, and Delivery User, each managing a specific aspect of the application.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
2. [Getiing Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
3. [Usage](#usage)
4. [API Documentation](#api-documentation)
5. [Configuration](#configuration)
6. [Build](#build)
7. [Deployment](#deployment)
8. [Contribution](#contribution)
9. [Contact](#contact)

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


## Technologies Used

- Node.js: As the Runtime for the Project
- Express.js: Frameword to create web-applications
- Typescript: For enhanced code quality and development experience
- MongoDB: As a NoSQL Database
- Docker: For Containerizing the application
- Multer: Middleware for handling  multipart/form-data, for uploading files
- Twilio: For sending OTP for customer verification
- Render: For Deploying the application


## Getting Started

### Prerequisites

- Node.js installed
- Docker installed (if want to start through docker image)
- MongoDB database
- Twilio Account


### Installation

- For the installaion, please follow the following steps

- Clone the repository:
    ```bash
    git clone https://github.com/Deval1807/Food-Order-Backend
    cd Food-Order-Backend
    ```

- You can get started with the project in 2 ways. By simply starting the proj by installing dependencies and by Docker image.

1. Simple installation: 

    1. Install the dependencies:
        ```bash
        npm install
        ```

    2. Set up the [.env configuration](#configuration)

    3. Start the project in development:
        ```bash
        npm run dev
        ```

2. Through Docker:

    1. Make sure the Docker service is running

    2. Set up the [.env configuration](#configuration)

    3. Build the image
        ```
        docker-compose build
        ```
    
    4. Run the image
        ```
        docker-compose up
        ```

## Usage

Once the server is running, you can access the API endpoints using a tool like Postman or via your frontend application. The API documentation provides detailed information on each endpoint, including the request and response formats.


## API Documentation

For detailed API documentation, please visit [API Documentation](https://documenter.getpostman.com/view/33324941/2sA3Qy5pAF)


## Configuration

Ensure you have the following environment variables set up in your `.env` file:

```plaintext
PORT=<your-port>
MONGO_URI=<your-URI>
APP_SECRET=<your-secret-key>
TWILIO_SID=<your-twilio-sid>
TWILIO_AUTH_TOKEN=<your-twilio-auth-token>
TWILIO_PHONE_NUMBER=<your-twilio-phone-number>
```


## Build

To deploy the application, follow these steps:

1. Build the project
    ```bash
    npm run build
    ```

2. Start the built project
    ```bash
    npm start
    ```


## Deployment

The Deployed Project link: [Deployed Backend](https://food-order-backend-w6bv.onrender.com)


## Contribution

We welcome contributions from the community. To contribute, please fork the repository, create a new branch, and submit a pull request. Make sure to follow the coding standards and ethical practices. 


## Contact

For questions or support, please contact Deval Darji by following ways:

1. LinkedIn: [Deval Darji](https://www.linkedin.com/in/deval-darji-a15002226/)

2. Email: [deval135darji@gmail.com](mailto:deval135darji@gmail.com)