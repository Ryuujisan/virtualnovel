param(
    [Parameter(Mandatory)]
    [string]$ResourceGroup,

    [Parameter(Mandatory)]
    [string]$RegistryName,

    [Parameter(Mandatory)]
    [string]$FirebaseProjectId,

    [Parameter(Mandatory)]
    [string]$DatabaseConnectionString,

    [string]$Location = "polandcentral",
    [string]$EnvironmentName = "virtualnovel-env",
    [string]$Prefix = "virtualnovel",
    [string]$ImageTag = "latest"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path $PSScriptRoot -Parent

if (-not (Get-Command az -ErrorAction SilentlyContinue))
{
    throw "Azure CLI is not installed or is not available in PATH. Install it, reopen the terminal, and run az login."
}

function Invoke-AzureCli
{
    param([Parameter(ValueFromRemainingArguments)][string[]]$Arguments)

    & az @Arguments
    if ($LASTEXITCODE -ne 0)
    {
        throw "Azure CLI command failed: az $($Arguments[0]) $($Arguments[1])"
    }
}

if ($Prefix.Length -gt 20 -or $Prefix -notmatch '^[a-z][a-z0-9-]*[a-z0-9]$')
{
    throw "Prefix must be lowercase, start with a letter, end with a letter or digit, and have at most 20 characters."
}

Push-Location $repoRoot
try
{
    Invoke-AzureCli account show --output none
    Invoke-AzureCli group create `
        --name $ResourceGroup `
        --location $Location `
        --output none

    & az acr show --name $RegistryName --resource-group $ResourceGroup --output none 2>$null
    if ($LASTEXITCODE -ne 0)
    {
        Invoke-AzureCli acr create `
            --name $RegistryName `
            --resource-group $ResourceGroup `
            --location $Location `
            --sku Basic `
            --admin-enabled false `
            --output none
    }

    & az containerapp env show --name $EnvironmentName --resource-group $ResourceGroup --output none 2>$null
    if ($LASTEXITCODE -ne 0)
    {
        Invoke-AzureCli containerapp env create `
            --name $EnvironmentName `
            --resource-group $ResourceGroup `
            --location $Location `
            --output none
    }

    $registryServer = (& az acr show `
        --name $RegistryName `
        --resource-group $ResourceGroup `
        --query loginServer `
        --output tsv).Trim()
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($registryServer))
    {
        throw "Could not read the Azure Container Registry login server."
    }

    $images = @(
        @{ Name = "users"; Dockerfile = "src/VirtualNovel.UserService/Dockerfile" },
        @{ Name = "novels"; Dockerfile = "src/VirtualNovel.NovelService/Dockerfile" },
        @{ Name = "gateway"; Dockerfile = "src/VirtualNovel.Gateway/Dockerfile" },
        @{ Name = "frontend"; Dockerfile = "src/VirtualNovel.Frontend/Dockerfile" }
    )

    foreach ($image in $images)
    {
        Write-Host "Building $($image.Name) in ACR..." -ForegroundColor Cyan
        Invoke-AzureCli acr build `
            --registry $RegistryName `
            --image "virtualnovel-$($image.Name):$ImageTag" `
            --file $image.Dockerfile `
            . `
            --output none
    }

    $usersName = "$Prefix-users"
    $novelsName = "$Prefix-novels"
    $gatewayName = "$Prefix-gateway"
    $frontendName = "$Prefix-web"

    Invoke-AzureCli containerapp create `
        --name $usersName `
        --resource-group $ResourceGroup `
        --environment $EnvironmentName `
        --image "$registryServer/virtualnovel-users:$ImageTag" `
        --ingress internal `
        --target-port 8080 `
        --system-assigned `
        --registry-server $registryServer `
        --registry-identity system `
        --min-replicas 1 `
        --max-replicas 3 `
        --secrets "database=$DatabaseConnectionString" `
        --env-vars `
            "ASPNETCORE_ENVIRONMENT=Production" `
            "ASPNETCORE_URLS=http://+:8080" `
            "ASPNETCORE_FORWARDEDHEADERS_ENABLED=true" `
            "Database__ApplyMigrations=true" `
            "Firebase__ProjectId=$FirebaseProjectId" `
            "ConnectionStrings__Database=secretref:database" `
        --output none

    Invoke-AzureCli containerapp create `
        --name $novelsName `
        --resource-group $ResourceGroup `
        --environment $EnvironmentName `
        --image "$registryServer/virtualnovel-novels:$ImageTag" `
        --ingress internal `
        --target-port 8080 `
        --system-assigned `
        --registry-server $registryServer `
        --registry-identity system `
        --min-replicas 1 `
        --max-replicas 3 `
        --secrets "database=$DatabaseConnectionString" `
        --env-vars `
            "ASPNETCORE_ENVIRONMENT=Production" `
            "ASPNETCORE_URLS=http://+:8080" `
            "ASPNETCORE_FORWARDEDHEADERS_ENABLED=true" `
            "Database__ApplyMigrations=true" `
            "Firebase__ProjectId=$FirebaseProjectId" `
            "ConnectionStrings__Database=secretref:database" `
            "Services__UserService=http://$usersName" `
        --output none

    Invoke-AzureCli containerapp create `
        --name $gatewayName `
        --resource-group $ResourceGroup `
        --environment $EnvironmentName `
        --image "$registryServer/virtualnovel-gateway:$ImageTag" `
        --ingress internal `
        --target-port 8080 `
        --system-assigned `
        --registry-server $registryServer `
        --registry-identity system `
        --min-replicas 1 `
        --max-replicas 3 `
        --env-vars `
            "ASPNETCORE_ENVIRONMENT=Production" `
            "ASPNETCORE_URLS=http://+:8080" `
            "ASPNETCORE_FORWARDEDHEADERS_ENABLED=true" `
            "Firebase__ProjectId=$FirebaseProjectId" `
            "ReverseProxy__Clusters__users-cluster__Destinations__destination1__Address=http://$usersName/" `
            "ReverseProxy__Clusters__novels-cluster__Destinations__destination1__Address=http://$novelsName/" `
        --output none

    Invoke-AzureCli containerapp create `
        --name $frontendName `
        --resource-group $ResourceGroup `
        --environment $EnvironmentName `
        --image "$registryServer/virtualnovel-frontend:$ImageTag" `
        --ingress external `
        --target-port 8080 `
        --system-assigned `
        --registry-server $registryServer `
        --registry-identity system `
        --min-replicas 1 `
        --max-replicas 3 `
        --env-vars "GATEWAY_URL=http://$gatewayName" `
        --output none

    $frontendFqdn = (& az containerapp show `
        --name $frontendName `
        --resource-group $ResourceGroup `
        --query properties.configuration.ingress.fqdn `
        --output tsv).Trim()

    Write-Host "Deployment completed." -ForegroundColor Green
    Write-Host "Frontend: https://$frontendFqdn"
}
finally
{
    Pop-Location
}
