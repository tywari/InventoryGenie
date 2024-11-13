# Inventory Management Application - InventoryGenie

Welcome to the **Inventory Management Application**, a full-stack project built with **Laravel 11** for the backend and **React** for the frontend. This application leverages **Docker** and **Docker Compose** to provide a seamless and consistent development environment, ensuring that both backend and frontend services run smoothly together. Real-time inventory updates are facilitated using **Pusher** and **Laravel Echo**, ensuring instant synchronization between the backend and frontend.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Environment Configuration](#2-environment-configuration)
3. [Running the Application](#running-the-application)
    - [1. Build and Start Docker Containers](#1-build-and-start-docker-containers)
    - [2. Accessing the Services](#2-accessing-the-services)
4. [Additional Setup](#additional-setup)
    - [1. Running Migrations and Seeders](#1-running-migrations-and-seeders)
    - [2. Running Laravel Queue Workers](#2-running-laravel-queue-workers)
5. [Testing Real-Time Functionality](#testing-real-time-functionality)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Docker:**  
   - [Download Docker](https://www.docker.com/get-started)  
   - Verify installation:
     ```bash
     docker --version
     ```

2. **Docker Compose:**  
   - Comes bundled with Docker Desktop.  
   - Verify installation:
     ```bash
     docker-compose --version
     ```

3. **Git:**  
   - [Download Git](https://git-scm.com/downloads)  
   - Verify installation:
     ```bash
     git --version
     ```

4. **Optional Tools:**  
   - **Postman:** For API testing. [Download Postman](https://www.postman.com/downloads/)  
   - **VSCode or Preferred IDE:** For code editing. [Download VSCode](https://code.visualstudio.com/)

---

## Installation

### 1. Clone the Repository

Start by cloning the project repository to your local machine.

```bash
git clone https://github.com/tywari/InventoryGenie
cd InventoryGenie
run docker-compose up -d --build to start the project
```

```bash
# Application Settings
APP_NAME=auth-serivce
APP_ENV=local
APP_KEY=base64:GENERATED_KEY
APP_DEBUG=true
APP_URL=http://localhost
```

## Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=inventory_db
DB_USERNAME=root
DB_PASSWORD=your_db_password

# Pusher Configuration
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_SECRET=your_pusher_app_secret
PUSHER_APP_CLUSTER=your_pusher_cluster

# Queue Configuration
QUEUE_CONNECTION=database

# Do the same for other serivices

# Frontend end vars
# React App Settings
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_PUSHER_KEY=your_pusher_app_key
REACT_APP_PUSHER_CLUSTER=your_pusher_cluster
REACT_APP_ORDER_API_URL=http://localhost:8000/api
REACT_APP_INVENTORY_API_URL=http://localhost:8000/api

Running the Application
Once both the backend and frontend are set up and configured, follow these steps to run the application.

# 1. Start Laravel Backend
If you have not already, navigate to the backend directory and start the Laravel development server.

cd backend
php artisan serve
Default URL:
The Laravel server runs at http://localhost:8000

# 2. Start React Frontend
Open a new terminal window/tab, navigate to the frontend directory, and start the React development server.

cd frontend
npm start
Default URL:
The React app runs at http://localhost:3000

# 3. Run Laravel Queue Workers
Since your Laravel backend uses queued listeners for handling events, ensure that queue workers are running to process these jobs.

cd backend
php artisan queue:work
Note:

# Persistence:
Keep this process running in your terminal. For production environments, use a process manager like Supervisor.
Testing Real-Time Functionality
To verify that real-time updates are working correctly, perform the following steps:

Ensure All Services Are Running:

Laravel server
React frontend
Laravel queue worker
Open Multiple Browser Tabs:

Open the InventoryDetail page for the same inventory item in multiple browser tabs or windows.
Update Inventory Quantity:

In one tab, update the quantity of the inventory item using the form.
Upon successful update, observe that the other tabs receive real-time updates without refreshing.
Check Notifications:

Ensure that notifications appear in real-time across all open instances of the application.
Monitor Pusher Debug Console:

Log into your Pusher Dashboard and navigate to the Debug Console.
Observe the events being broadcasted (inventory.updated) with the correct payload.




