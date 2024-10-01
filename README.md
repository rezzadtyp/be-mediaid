# Express API Template

This repository contains a template for setting up an Express API project. Follow the instructions below to set up and run the project locally.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18.0 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/danielreinhard1129/template-express-prisma-ts
    cd template-express-prisma-ts
    ```

2. **Create a `.env` file based on `.env.example`:**

    ```bash
    cp .env.example .env
    ```

    Edit the `.env` file and update the environment variables as needed.

3. **Install dependencies:**

    ```bash
    npm install
    ```

4. **Run database migrations:**

    ```bash
    npx prisma migrate dev
    ```

### Running the Project

To run the project in development mode:

```bash
npm run dev
```
To run the project in production mode:

```bash
npm run start