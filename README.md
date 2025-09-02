## Quick Start Guide

### Prerequisites

- **Docker**: Install Docker from [here](https://www.docker.com/).
- **Node.js**: Install Node.js from [here](https://nodejs.org/).

### Setup and Run

1. Clone the repository:
   ```bash
   git clone https://github.com/kaufon/enigma-server.git
   cd enigma-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure it:
   ```bash
   cp .env.example .env
   ```

4. Start the services:
   ```bash
   docker-compose up -d
   npm run start:dev
   ```

### Additional Commands

- To run database migrations:
  ```bash
  npm run db:migrate
  ```

- To view the database in Prisma Studio:
  ```bash
  npm run db:studio
  ```

- To run tests:
  ```bash
  npm test
  ```
