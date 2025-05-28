import {HOMEROUTER, LOGINROUTER, PROFILEROUTER, REGISTERROUTER} from "./utils/consts";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";


export const publicRoutes = [
    {
        path: LOGINROUTER,
        element: <Auth />
    },
    {
        path: REGISTERROUTER,
        element: <Auth />
    },
]

export const authRoutes = [
    {
        path: HOMEROUTER,
        element: <Home/>
    },
    {
        path: PROFILEROUTER,
        element: <Profile/>
    },
]
