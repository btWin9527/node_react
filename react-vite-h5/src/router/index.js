import Home from "../container/Home";
import Data from "../container/Data";
import User from "../container/User";
import Login from "../container/Login";

const routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/data',
        component: Data
    },
    {
        path: '/user',
        component: User
    },
    {
        path: '/login',
        component: Login
    }
];

export default routes;