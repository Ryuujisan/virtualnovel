param()

$ErrorActionPreference = "Stop"
. (Join-Path $PSScriptRoot "DatabaseServices.ps1")

$repoRoot = Split-Path $PSScriptRoot -Parent

Push-Location $repoRoot
try
{
    foreach ($service in $DatabaseServices)
    {
        $project = Join-Path $repoRoot "src\$service\$service.csproj"

        if (-not (Test-Path -LiteralPath $project))
        {
            throw "Nie znaleziono projektu: $project"
        }

        Write-Host "Aktualizacja bazy dla $service..." -ForegroundColor Cyan

        dotnet ef database update `
            --project $project `
            --startup-project $project

        if ($LASTEXITCODE -ne 0)
        {
            throw "Aktualizacja bazy dla $service nie powiodła się."
        }
    }

    Write-Host "Wszystkie bazy zostały zaktualizowane." -ForegroundColor Green
}
finally
{
    Pop-Location
}
