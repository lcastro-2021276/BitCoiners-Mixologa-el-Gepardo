#!/bin/bash

# Gepardo Stack Bootstrap Script
# This script sets up the environment and starts all services

set -e

echo "🚀 Gepardo Stack Bootstrap Script"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from .env.docker.example...${NC}"
    cp .env.docker.example .env
    echo -e "${GREEN}✅ Created .env file. Please review and update the values.${NC}"
    echo -e "${YELLOW}⚠️  IMPORTANT: Update JWT_SECRET and MONGO_ROOT_PASSWORD before proceeding!${NC}"
    read -p "Press Enter to continue after updating .env file..."
fi

# Create necessary directories
echo -e "${YELLOW}📁 Creating necessary directories...${NC}"
mkdir -p ../server-admin/logs
mkdir -p ../Client-AdminGepardo/logs

# Build and start services
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose build

echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check service status
echo -e "${GREEN}✅ Checking service status...${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}✅ Gepardo Stack is now running!${NC}"
echo ""
echo "📊 Services:"
echo "  - MongoDB: localhost:27017"
echo "  - Backend API: http://localhost:3000"
echo "  - Frontend Admin: http://localhost"
echo "  - API Documentation: http://localhost:3000/api-docs"
echo ""
echo "📝 Useful commands:"
echo "  - View logs: docker-compose logs -f"
echo "  - Stop services: docker-compose down"
echo "  - Restart services: docker-compose restart"
echo "  - View service status: docker-compose ps"
echo ""
