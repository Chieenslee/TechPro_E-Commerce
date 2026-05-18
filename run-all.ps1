param(
    [switch]$ImportData,
    [switch]$SkipDatabase,
    [switch]$KeepExisting
)

$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackendDir = Join-Path $Root "backend"
$FrontendDir = Join-Path $Root "frontend"
$SchemaPath = Join-Path $Root "database\schema.sql"
$ImportScript = Join-Path $Root "database\import-json-data.ps1"
$DataDir = Join-Path $BackendDir "Data"
$ConnectionString = "Server=localhost;Database=TechPro;Trusted_Connection=True;TrustServerCertificate=True"

function Write-Step {
    param([string]$Message)
    Write-Host "[TechPro] $Message" -ForegroundColor Cyan
}

function Test-CommandExists {
    param([string]$Command)
    return $null -ne (Get-Command $Command -ErrorAction SilentlyContinue)
}

function Stop-PortOwner {
    param([int]$Port)

    $connections = @(Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 })
    foreach ($connection in $connections) {
        $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        if ($null -ne $process) {
            Write-Step "Stopping process $($process.ProcessName) ($($process.Id)) on port $Port"
            Stop-Process -Id $process.Id -Force
        }
    }
}

function Invoke-Sql {
    param(
        [string]$Query,
        [string]$Database = "master"
    )

    sqlcmd -S localhost -d $Database -b -Q $Query
}

function Ensure-Database {
    if (-not (Test-CommandExists "sqlcmd")) {
        Write-Warning "sqlcmd not found. Skipping SQL setup."
        return
    }

    Write-Step "Checking SQL Server localhost"
    Invoke-Sql -Query "SELECT @@SERVERNAME AS ServerName" | Out-Null

    $dbState = sqlcmd -S localhost -h -1 -W -Q "IF DB_ID('TechPro') IS NULL SELECT 'missing' ELSE SELECT 'exists'"
    if (($dbState | Select-Object -Last 1).Trim() -eq "missing") {
        Write-Step "Creating database TechPro"
        Invoke-Sql -Query "CREATE DATABASE TechPro"
    }

    $hasProductsTable = sqlcmd -S localhost -d TechPro -h -1 -W -Q "IF OBJECT_ID('dbo.Products') IS NULL SELECT 'missing' ELSE SELECT 'exists'"
    if (($hasProductsTable | Select-Object -Last 1).Trim() -eq "missing") {
        Write-Step "Applying database schema"
        sqlcmd -S localhost -d TechPro -b -i $SchemaPath
        $script:ImportData = $true
    }

    if ($ImportData) {
        Write-Step "Importing JSON data into SQL"
        & $ImportScript -ConnectionString $ConnectionString -DataDirectory $DataDir
    }
}

Write-Step "Starting TechPro full stack"

if (-not $SkipDatabase) {
    Ensure-Database
}

if (-not $KeepExisting) {
    Stop-PortOwner -Port 7099
    Stop-PortOwner -Port 5016
    Stop-PortOwner -Port 5173
}

Write-Step "Starting backend: https://localhost:7099"
$backend = Start-Process `
    -FilePath "dotnet" `
    -ArgumentList @("run", "--urls", "https://localhost:7099;http://localhost:5016") `
    -WorkingDirectory $BackendDir `
    -WindowStyle Hidden `
    -PassThru

Write-Step "Starting frontend: http://localhost:5173"
$frontend = Start-Process `
    -FilePath "powershell" `
    -ArgumentList @("-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", "pnpm dev --host localhost --port 5173") `
    -WorkingDirectory $FrontendDir `
    -WindowStyle Hidden `
    -PassThru

Start-Sleep -Seconds 4

Write-Host ""
Write-Host "TechPro is starting." -ForegroundColor Green
Write-Host "Backend PID : $($backend.Id)"
Write-Host "Frontend PID: $($frontend.Id)"
Write-Host "Backend     : https://localhost:7099"
Write-Host "Frontend    : http://localhost:5173"
Write-Host ""
Write-Host "Options:"
Write-Host "  .\run-all.ps1 -ImportData     Re-import backend/Data JSON into SQL"
Write-Host "  .\run-all.ps1 -SkipDatabase   Skip SQL checks/import"
Write-Host "  .\run-all.ps1 -KeepExisting   Do not stop processes on ports 7099/5016/5173"
