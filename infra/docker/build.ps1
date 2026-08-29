param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "prod")]
    [string]$Environment
)

$composeFiles = @(
    "-f", "compose.yml",
    "-f", "compose.$Environment.yml"
)

Write-Host "Starting Xeubiart in '$Environment' environment..." -ForegroundColor Cyan

if ($Environment -eq "prod") {
    Write-Host "Pulling latest Docker images..." -ForegroundColor Cyan

    docker compose @composeFiles pull

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker pull failed. Aborting startup." -ForegroundColor Red
        exit 1
    }
}

Write-Host "Building Docker images..." -ForegroundColor Cyan

docker compose @composeFiles build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed. Aborting startup." -ForegroundColor Red
    exit 1
}

Write-Host "Starting containers..." -ForegroundColor Green

docker compose @composeFiles up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to start containers." -ForegroundColor Red
    exit 1
}