param()

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path $PSScriptRoot -Parent
$runtimeDirectory = Join-Path $repoRoot ".run"
$processFile = Join-Path $runtimeDirectory "processes.json"

if (-not (Test-Path -LiteralPath $processFile))
{
    Write-Host "Brak zapisanych procesow developerskich." -ForegroundColor Yellow
    exit 0
}

$processes = Get-Content $processFile -Raw | ConvertFrom-Json
$failedApplications = @()

for ($index = 0; $index -lt $processes.Count; $index++)
{
    $application = $processes[$index]
    $processId = [int]$application.ProcessId

    if (Get-Process -Id $processId -ErrorAction SilentlyContinue)
    {
        Write-Host "Zatrzymywanie $($application.Name)..." -ForegroundColor Cyan
        & taskkill.exe /PID "$processId" /T /F | Out-Null

        if ($LASTEXITCODE -ne 0)
        {
            $failedApplications += $application.Name
        }
    }
    else
    {
        Write-Host "$($application.Name) juz nie dziala." -ForegroundColor DarkGray
    }
}

if ($failedApplications.Count -gt 0)
{
    $names = $failedApplications -join ", "
    throw "Nie udalo sie zatrzymac: $names. Plik procesow zostal zachowany."
}

Remove-Item -LiteralPath $processFile -Force
Write-Host "Wszystkie aplikacje zostaly zatrzymane." -ForegroundColor Green
