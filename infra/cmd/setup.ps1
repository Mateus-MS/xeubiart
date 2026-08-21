# Check if Task is installed; if not, install via Winget
if (-not (Get-Command task -ErrorAction SilentlyContinue)) {
    Write-Host "Task is not installed. Installing Task..." -ForegroundColor Cyan
    winget install Task.Task --accept-source-agreements --accept-package-agreements
    
    # Refresh environment variables for the current session
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
} else {
    Write-Host "Task is already installed!" -ForegroundColor Green
}

# Run task init
Write-Host "Running 'task init'..." -ForegroundColor Cyan
task init