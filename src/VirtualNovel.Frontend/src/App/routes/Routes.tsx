import {createBrowserRouter, Navigate} from "react-router-dom";
import MainLayout from "../../layauts/MainLayout.tsx";
import Home from "../../pages/Home.tsx";
import Novel from "../../pages/Novel.tsx";
import Chapter from "../../pages/Chapter.tsx";
import NovelsSearch from "../../pages/NovelsSearch.tsx";
import NotFound from "../../pages/NotFound.tsx";
import Register from "../../pages/Register.tsx";
import Login from "../../pages/Login.tsx";
import Profile from "../../pages/Profile.tsx";
import NovelManagement from "../../pages/NovelManagement.tsx";
import ProtectedRoute from "../../layauts/ProtectedRoute.tsx";
import NovelWriter from "../../pages/NovelWriter.tsx";
import ChapterWriter from "../../pages/ChapterWriter.tsx";

export const routes = createBrowserRouter([
    {
        element: <MainLayout/>,
        children: [
            {path:"", element: <Home/>},
            {path:"/login", element: <Login />},
            {path:"/register", element: <Register />},
            {path:"/profile/:id", element: <Profile />},


            {path:"/novels", element: <NovelsSearch/>},
            {path:"/novels/:id", element: <Novel/>},
            {path:"/novels/:novelId/chapter/:order", element: <Chapter />},
            {path:"/notfound", element: <NotFound />},
            { path: "*", element: <Navigate to="/notfound" replace />},
            {path:"/chapterwriter", element: <ChapterWriter />},
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {path:"/create", element: <NovelManagement />},
            {path:"/novelwriter", element: <NovelWriter />},

        ]
    }
])
