param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern('^[A-Za-z][A-Za-z0-9_]*$')]
    [string]$MigrationName
)

$ErrorActionPreference = "Stop"

& (Join-Path $PSScriptRoot "Add-Migration.ps1") `
    -MigrationName $MigrationName

if ($LASTEXITCODE -ne 0)
{
    throw "Nie udało się utworzyć migracji. Bazy nie zostały zmienione."
}

& (Join-Path $PSScriptRoot "Update-Databases.ps1")

if ($LASTEXITCODE -ne 0)
{
    throw "Nie udało się zaktualizować wszystkich baz."
}
