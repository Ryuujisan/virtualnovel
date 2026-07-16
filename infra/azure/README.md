# VirtualNovel on Azure Container Apps

The production topology is:

- `virtualnovel-web`: public ingress, serves the React SPA and proxies `/api`;
- `virtualnovel-gateway`: internal ingress;
- `virtualnovel-users`: internal ingress;
- `virtualnovel-novels`: internal ingress;
- `virtualnovel-images`: internal ingress;
- Azure Container Registry: stores the five application images;
- Neon PostgreSQL: one shared database stores UserService and NovelService data.

RabbitMQ is intentionally not deployed to Azure yet because no application code uses it. The local Compose stack still includes it for future development.

## Prerequisites

1. Azure CLI with the Container Apps extension:

   ```powershell
   az extension add --name containerapp --upgrade
   az provider register --namespace Microsoft.App
   az provider register --namespace Microsoft.OperationalInsights
   ```

2. A Neon database accessible from the local development environment and
   Azure Container Apps.

3. Npgsql/.NET connection strings supplied by Neon, with TLS enabled. Use the
   semicolon-separated .NET format rather than the `postgresql://` URL:

   ```text
   Host=<neon-pooler-host>;Database=neondb;Username=neondb_owner;Password=<password>;SSL Mode=Require;Channel Binding=Require
   ```

## Deploy

Run from the repository root. The command explicitly bypasses a restrictive
local PowerShell execution policy for this one process:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\Deploy-Azure.ps1 `
    -ResourceGroup "virtualnovel-prod" `
    -RegistryName "<globally-unique-acr-name>" `
    -FirebaseProjectId "<firebase-project-id>" `
    -DatabaseConnectionString "<neon-connection-string>" `
    -ImageTag "v1"
```

The script:

1. creates or reuses the resource group, ACR and Container Apps environment;
2. builds all images remotely in ACR;
3. creates internal UserService, NovelService, ImageService and Gateway applications;
4. stores database connection strings as Container Apps secrets;
5. creates the public frontend application;
6. prints the final HTTPS address.

`Database__ApplyMigrations=true` applies EF migrations during service startup. Development seed data is never inserted in Production.

The local Compose stack passes the same Neon database to both services from
`DATABASE_CONNECTION_STRING` in the repository-level `.env` file. That file
is ignored by Git.

## Updating

Use a new immutable image tag for every deployment:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\Deploy-Azure.ps1 ... -ImageTag "v2"
```

Do not put real passwords, Firebase credentials or connection strings in `.env`, Compose files, source control or command examples.
