import Home from "../container/Home";
import Data from "../container/Data";
import User from "../container/User";
import Login from "../container/Login";
import Detail from "../container/Detail";

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
    },
    {
        path: '/detail',
        component: Detail
    },

];

export default routes;