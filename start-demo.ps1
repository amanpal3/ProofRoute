Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  ProofRoute Hackathon One-Click Launch   " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Docker is not installed or not running." -ForegroundColor Red
    exit 1
}

Write-Host "`n1. Building and starting all containers..." -ForegroundColor Yellow
docker compose up --build -d

Write-Host "`n2. Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 6

Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "  ProofRoute Services are Live!           " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  • Web Portal:       http://localhost:3000" -ForegroundColor White
Write-Host "  • Backend Swagger:  http://localhost:8000/docs" -ForegroundColor White
Write-Host "  • API Health Probe: http://localhost:8000/api/v1/health" -ForegroundColor White
Write-Host "  • ML Forensics:     http://localhost:8001/health" -ForegroundColor White
Write-Host "  • EVM Local Node:   http://localhost:8545" -ForegroundColor White
Write-Host "==========================================" -ForegroundColor Green
