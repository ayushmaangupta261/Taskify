# Taskify – Docker (Development Setup)

This project uses Docker to run the Frontend, Backend, MongoDB, and Redis locally for development.

---

## Environment Files

### Backend – `backend/.env.example`
```env
PORT=4000
NODE_ENV=development

MONGO_URI=mongodb://mongodb:27017/taskify
REDIS_URL=redis://redis:6379

JWT_SECRET=jwt_secret
REFRESH_SECRET=refresh_secret
```

### Frontend – `frontend/.env.example`
```env
VITE_APP_BASE_URL=http://localhost:4000
```

Each developer should create their own `.env` files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

---

## Running Taskify with Docker (Dev)

### Prerequisites
- Docker
- Docker Compose

---

## Install Docker & Docker Compose

### macOS
1. Download Docker Desktop:
   http://docs.docker.com/desktop/setup/install/mac-install/
2. Install and start Docker Desktop
3. Verify installation:
```bash
docker --version
docker compose version
```

---

### Windows
1. Download Docker Desktop:
   https://docs.docker.com/desktop/setup/install/windows-install/
2. Enable WSL 2 during installation
3. Restart system if required
4. Verify installation:
```bash
docker --version
docker compose version
```

---

### Ubuntu / Linux
1. Install Docker:
```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
```

2. Install Docker Compose:
```bash
sudo apt install -y docker-compose-plugin
```

3. Optional: Run Docker without sudo:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

4. Verify installation:
```bash
docker --version
docker compose version
```

---

### Steps

#### 1. Clone the repository
```bash
git clone https://github.com/ayushmaangupta261/Taskify.git
cd Taskify
```

#### 2. Create environment files
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

#### 3. Build and start containers
```bash
docker compose up --build -d
```

---

## Access the Application

| Service   | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend  | http://localhost:4000 |
| MongoDB | mongodb://localhost:27017 |
| Redis   | redis://localhost:6379 |

---

## API Documentation (Swagger)

Swagger UI is served directly from the backend.

- Available only when `NODE_ENV=development`
- Runs on the same backend port
- No separate Swagger container is required

Access it at:
```text
http://localhost:4000/api-docs
```

---

## Stopping Containers

```bash
docker compose down
```

### Remove containers and database volumes
```bash
docker compose down -v
```

---

## What This Setup Provides

- Alpine-based Docker images
- Development-only configuration
- Frontend hot reload
- Backend connected to MongoDB and Redis
- Single command to run the full stack


---

## Notes
- `.env` files should not be committed
- MongoDB and Redis run locally inside Docker

