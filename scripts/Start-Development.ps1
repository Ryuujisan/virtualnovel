param(
    [ValidateSet("http", "https")]
    [string]$LaunchProfile = "https",

    [switch]$NoBuild
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path $PSScriptRoot -Parent
$srcRoot = Join-Path $repoRoot "src"
$runtimeDirectory = Join-Path $repoRoot ".run"
$processFile = Join-Path $runtimeDirectory "processes.json"
$logDirectory = Join-Path $runtimeDirectory "logs"

if (Test-Path -LiteralPath $processFile)
{
    $runningProcesses = Get-Content $processFile -Raw | ConvertFrom-Json
    $activeProcesses = @($runningProcesses | Where-Object {
        Get-Process -Id $_.ProcessId -ErrorAction SilentlyContinue
    })

    if ($activeProcesses.Count -gt 0)
    {
        $names = $activeProcesses.Name -join ", "
        throw "Aplikacje juz dzialaja: $names. Najpierw uruchom .\scripts\Stop-Development.ps1."
    }
}

New-Item -ItemType Directory -Path $logDirectory -Force | Out-Null

if (-not $NoBuild)
{
    Write-Host "Budowanie calej solucji..." -ForegroundColor Cyan
    dotnet build (Join-Path $repoRoot "VirtualNovel.slnx")

    if ($LASTEXITCODE -ne 0)
    {
        throw "Build nie powiodl sie. Zaden serwis nie zostal uruchomiony."
    }
}

$serviceProjects = Get-ChildItem -Path $srcRoot -Directory |
    Where-Object { $_.Name -like "VirtualNovel.*Service" } |
    ForEach-Object {
        $project = Join-Path $_.FullName "$($_.Name).csproj"
        if (Test-Path -LiteralPath $project)
        {
            [PSCustomObject]@{ Name = $_.Name; Project = $project }
        }
    } |
    Sort-Object Name

$gatewayProject = Join-Path $srcRoot "VirtualNovel.Gateway\VirtualNovel.Gateway.csproj"
if (-not (Test-Path -LiteralPath $gatewayProject))
{
    throw "Nie znaleziono projektu Gateway: $gatewayProject"
}

$projects = @($serviceProjects) + @(
    [PSCustomObject]@{
        Name = "VirtualNovel.Gateway"
        Project = $gatewayProject
    }
)

$startedProcesses = @()

try
{
    foreach ($application in $projects)
    {
        $safeName = $application.Name.Replace(".", "-")
        $standardOutput = Join-Path $logDirectory "$safeName.log"
        $standardError = Join-Path $logDirectory "$safeName.error.log"
        $arguments =
            "run --project `"$($application.Project)`" --launch-profile $LaunchProfile --no-build"

        Write-Host "Uruchamianie $($application.Name)..." -ForegroundColor Cyan
        $process = Start-Process `
            -FilePath "dotnet" `
            -ArgumentList $arguments `
            -WorkingDirectory $repoRoot `
            -RedirectStandardOutput $standardOutput `
            -RedirectStandardError $standardError `
            -WindowStyle Hidden `
            -PassThru

        Start-Sleep -Milliseconds 500
        if ($process.HasExited)
        {
            throw "$($application.Name) zakonczyl dzialanie podczas startu. Sprawdz $standardError."
        }

        $startedProcesses += [PSCustomObject]@{
            Name = $application.Name
            ProcessId = $process.Id
            Project = $application.Project
            StandardOutput = $standardOutput
            StandardError = $standardError
        }
    }

    $startedProcesses | ConvertTo-Json | Set-Content -Path $processFile -Encoding UTF8
}
catch
{
    foreach ($startedProcess in $startedProcesses)
    {
        taskkill /PID $startedProcess.ProcessId /T /F 2>$null | Out-Null
    }

    throw
}

Write-Host "" 
Write-Host "Uruchomiono $($startedProcesses.Count) aplikacji." -ForegroundColor Green
Write-Host "Logi: $logDirectory"
Write-Host "Zatrzymanie: .\scripts\Stop-Development.ps1"
