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
6. [Troubleshooting](#troubleshooting)
7. [Contributing](#contributing)
8. [License](#license)
9. [Acknowledgements](#acknowledgements)

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
