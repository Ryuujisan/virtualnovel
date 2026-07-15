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
import Create from "../../pages/Create.tsx";

export const routes = createBrowserRouter([
    {
        element: <MainLayout/>,
        children: [
            {path:"", element: <Home/>},
            {path:"/login", element: <Login />},
            {path:"/register", element: <Register />},
            {path:"/profile/:id", element: <Profile />},
            {path:"/create", element: <Create />},

            {path:"/novels", element: <NovelsSearch/>},
            {path:"/novels/:id", element: <Novel/>},
            {path:"/novels/:novelId/chapter/:order", element: <Chapter />},
            {path:"/notfound", element: <NotFound />},
            { path: "*", element: <Navigate to="/notfound" replace />}
        ]
    }
])
