#!/usr/bin/env bash
set -e

echo "=========================================="
echo "  ProofRoute Hackathon One-Click Launch   "
echo "=========================================="

if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed or not running."
    exit 1
fi

echo ""
echo "1. Building and starting all containers..."
docker compose up --build -d

echo ""
echo "2. Waiting for services to initialize..."
sleep 6

echo ""
echo "=========================================="
echo "  ProofRoute Services are Live!           "
echo "=========================================="
echo "  • Web Portal:       http://localhost:3000"
echo "  • Backend Swagger:  http://localhost:8000/docs"
echo "  • API Health Probe: http://localhost:8000/api/v1/health"
echo "  • ML Forensics:     http://localhost:8001/health"
echo "  • EVM Local Node:   http://localhost:8545"
echo "=========================================="
