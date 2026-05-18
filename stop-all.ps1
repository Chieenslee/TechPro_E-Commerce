param(
    [int[]]$Ports = @(7099, 5016, 5173)
)

$ErrorActionPreference = "Stop"

function Write-Step {
    param([string]$Message)
    Write-Host "[TechPro] $Message" -ForegroundColor Cyan
}

foreach ($port in $Ports) {
    $connections = @(Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 })
    if ($connections.Count -eq 0) {
        Write-Step "No process found on port $port"
        continue
    }

    foreach ($connection in $connections) {
        $process = Get-Process -Id $connection.OwningProcess -ErrorAction SilentlyContinue
        if ($null -eq $process) {
            continue
        }

        Write-Step "Stopping $($process.ProcessName) ($($process.Id)) on port $port"
        Stop-Process -Id $process.Id -Force
    }
}

Write-Host "TechPro dev stack stopped." -ForegroundColor Green
