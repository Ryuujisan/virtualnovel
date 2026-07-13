import {RouterProvider} from "react-router/dom";
import {routes} from "./Routes.tsx";

export const Root = () => {

    return <RouterProvider router={routes} />;
};
