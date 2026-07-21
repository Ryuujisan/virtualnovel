![.NET](https://img.shields.io/badge/.NET-10-512BD4?style=for-the-badge&logo=dotnet)

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript)

![Azure](https://img.shields.io/badge/Azure-Container%20Apps-0078D4?style=for-the-badge&logo=microsoftazure)

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql)

![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase)

# 📚 VirtualNovel


> Modern web platform for publishing and reading light novels built with **ASP.NET Core**, **React**, **Azure Container Apps**, and **PostgreSQL**.

🌐 **Live Demo:** https://virtualnovel-frontend.calmflower-354bd9be.polandcentral.azurecontainerapps.io/
> ⚠️ The application is hosted on Azure Container Apps.
> The first request may take a few seconds due to cold start.

---

## ✨ Features

- 📖 Create and manage novels
- 📚 Chapter editor
- 👤 Firebase Authentication
- ❤️ Follow authors
- ⭐ Novel ratings
- 🔖 Bookmarks
- 📱 Responsive UI
- ☁️ Azure Cloud deployment

---

## 🏗️ Architecture

```text
React (Vite)
        │
        ▼
     Nginx
        │
        ▼
 ASP.NET Gateway (YARP)
   │         │
   │         ├─────────────► User Service
   │
   ├─────────► Novel Service
   │
   ├─────────► Image Service
   │
   └─────────► Identity Service

             │
             ▼
      PostgreSQL (Neon)
```

---

## 🛠️ Tech Stack

### Backend

- ASP.NET Core 10
- Entity Framework Core
- PostgreSQL
- YARP Reverse Proxy
- Firebase Authentication
- REST API

### Frontend

- React
- TypeScript
- Vite
- Material UI
- TanStack Query
- Axios

### Cloud

- Azure Container Apps
- Azure Container Registry
- Azure DevOps Pipelines
- Neon PostgreSQL

---

## 🚀 Live Demo

🔗 https://virtualnovel-frontend.calmflower-354bd9be.polandcentral.azurecontainerapps.io/

> The application is deployed on Azure Container Apps.
> Initial loading may take a few seconds because services can cold start.

---

## 📸 Screenshots

*(tu później wrzucisz screeny)*

---

## 📦 Microservices

- Gateway
- User Service
- Novel Service
- Image Service
- Identity Service

---

## 🚧 Planned Features

- Comments
- Notifications
- Reading history
- Recommendations
- Admin Panel
- Full-text search
- AI-assisted novel editor

---

## 📄 License

MIT