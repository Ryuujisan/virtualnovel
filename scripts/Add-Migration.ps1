param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z][A-Za-z0-9_]*$')]
    [string]$MigrationName
)

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

        Write-Host "Tworzenie migracji '$MigrationName' dla $service..." -ForegroundColor Cyan

        dotnet ef migrations add $MigrationName `
            --project $project `
            --startup-project $project `
            --output-dir Migrations

        if ($LASTEXITCODE -ne 0)
        {
            throw "Tworzenie migracji dla $service nie powiodło się."
        }
    }

    Write-Host "Migracje zostały utworzone dla wszystkich serwisów." -ForegroundColor Green
}
finally
{
    Pop-Location
}
