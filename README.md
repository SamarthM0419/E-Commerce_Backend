<h1 align="center">E-COMMERCE_BACKEND</h1>

<p align="center">
  <i>Using Microservices Architecture</i>
</p>

<p align="center">
  <img src="https://img.shields.io/github/last-commit/SamarthM0419/E-Commerce_Backend?label=last%20commit&color=blue" />
  <img src="https://img.shields.io/github/languages/top/SamarthM0419/E-Commerce_Backend?color=yellow" />
  <img src="https://img.shields.io/github/languages/count/SamarthM0419/E-Commerce_Backend?color=green" />
</p>

---

## 🚀 Built with the tools and technologies:

<p align="center">
  <img src="https://img.shields.io/badge/Express-black?logo=express" />
  <img src="https://img.shields.io/badge/JSON-black?logo=json" />
  <img src="https://img.shields.io/badge/Markdown-black?logo=markdown" />
  <img src="https://img.shields.io/badge/npm-red?logo=npm" />
  <img src="https://img.shields.io/badge/Redis-red?logo=redis" />
  <img src="https://img.shields.io/badge/Mongoose-red?logo=mongoose" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/.env-yellow" />
  <img src="https://img.shields.io/badge/JavaScript-yellow?logo=javascript" />
  <img src="https://img.shields.io/badge/Docker-blue?logo=docker" />
  <img src="https://img.shields.io/badge/Cloudinary-blue?logo=cloudinary" />
  <img src="https://img.shields.io/badge/Axios-purple?logo=axios" />
</p>

## 📑 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [Features](#features)


## 📌 Overview

**E-Commerce_Backend** is a scalable **microservices-based backend architecture** designed to power modern and secure e-commerce platforms. It integrates core functionalities such as **user authentication**, **product management**, **order processing**, **vendor onboarding**, and **notifications** into a unified system.

Built using **Node.js** and orchestrated with **Docker Compose**, the backend supports flexible deployment, seamless service interaction, and high scalability—making it suitable for real-world production environments.


## ❓ Why E-Commerce_Backend?

This project streamlines the development of complex e-commerce systems by providing:

- 🧩 **Modular Microservices**: Independent services for authentication, products, orders, vendors, payments, and notifications—enabling scalable and maintainable codebases.

- 🔐 **Secure Authentication**: JWT-based login, session validation, and role-based access control for robust security.

- ⚡ **Real-Time Event Communication**: Redis-powered event bus for asynchronous messaging and notifications.

- 🖼️ **Media Management**: Cloudinary integration for efficient media uploads and transformations.

- 🐳 **Containerized Deployment**: Docker Compose setup for easy, consistent deployment across environments.

- 📬 **Automated Notifications**: Event-driven email templates and listeners for user engagement and operational alerts.

## ⚙️ Installation

Build **E-Commerce_Backend** from the source and install dependencies:


### 1️⃣ Clone the repository

git clone https://github.com/SamarthM0419/E-Commerce_Backend.git

### 2 Navigate to project directory
cd E-Commerce_Backend/src

## ▶️ Running the Project

You can run **E-Commerce_Backend** using either **Docker (recommended)** or **npm**.

---

### 🐳 Run Using Docker (Recommended)

> Ensure **Docker** and **Docker Compose** are installed.

#### Build the Docker images

- docker-compose build

- docker-compose up


📦 Run Using npm

Ensure Node.js and npm are installed.

Install dependencies
  - npm install

Start the server
  - npm start

Check in package.json how to run or run using the filename in which server configuration is done.




##  Features

- 🔐 **Authentication & Authorization**
  - JWT-based secure login and signup
  - Role-based access control (Admin, User, Vendor)

- 🛒 **Product Management**
  - Create, update, delete, and fetch products
  - Category and inventory management
  - Product image uploads via Cloudinary

- 🧺 **Cart & Order Processing**
  - Add/remove items from cart
  - Place and track orders
  - Order status management

- ⚡ **Caching & Performance**
  - Redis-based caching for faster data access
  - Reduced database load and improved response times

- 📬 **Notifications System**
  - Event-driven notifications
  - Automated email triggers for orders and user actions

- 🧩 **Microservices Architecture**
  - Independent, loosely coupled services
  - Scalable and maintainable backend design

- 🐳 **Dockerized Deployment**
  - Docker & Docker Compose support
  - Consistent environments across development and production

- 🔄 **RESTful APIs**
  - Well-structured REST APIs
  - Clean request/response handling

- ⚙️ **Environment-Based Configuration**
  - Secure `.env` configuration
  - Separate configs for development and production

- 🧪 **Developer-Friendly**
  - Modular code structure
  - Easy local setup and testing

