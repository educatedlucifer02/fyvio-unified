FROM node:18-alpine as frontend-builder

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install

COPY frontend/ .
RUN npm run build

FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy Python requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./static

# Set working directory for backend
WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Set environment variables
ENV PYTHONPATH=/app

# Start the application
CMD ["uvicorn", "fastapi.main:app", "--host", "0.0.0.0", "--port", "8000"]