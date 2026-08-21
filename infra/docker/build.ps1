Write-Host "Pulling latest Docker images from GHCR..." -ForegroundColor Cyan
docker compose pull

if ($LASTEXITCODE -eq 0) {
    Write-Host "Starting containers..." -ForegroundColor Green
    docker compose up -d
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Docker pull failed. Aborting startup." -ForegroundColor Red
}