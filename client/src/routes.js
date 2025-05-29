import {HOMEROUTER, LOGINROUTER, PROFILEROUTER, PROPERTYROUTER, REGISTERROUTER} from "./utils/consts";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import PropertyPage from "./pages/PropertyPage";


export const publicRoutes = [
    {
        path: LOGINROUTER,
        element: <Auth />
    },
    {
        path: REGISTERROUTER,
        element: <Auth />
    },
    {
        path: HOMEROUTER,
        element: <Home/>
    },
    {
        path: PROPERTYROUTER + '/:id',
        element: <PropertyPage/>
    },
]

export const authRoutes = [

    {
        path: PROFILEROUTER + '/:tab',
        element: <Profile/>
    },
    {
        path: PROFILEROUTER + '/:tab',
        element: <Profile/>
    },
    {
        path: PROFILEROUTER + '/:tab',
        element: <Profile/>
    },
]
