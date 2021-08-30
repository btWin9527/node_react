import React, {useState, useEffect} from 'react';
import {Switch, Route, useLocation} from "react-router-dom";
import {ConfigProvider} from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';

import NavBar from "@/components/NavBar";
import routes from "@/router";

function App() {
    // 想要在函数组件内执行 useLocation，该组件必须被 Router 高阶组件包裹
    const location = useLocation(); // 拿到location实例
    const {pathname} = location; // 获取当前路径
    const needNav = ['/', '/data', '/user']; // 需要底部导航栏的路径
    const [showNav, setShowNav] = useState(false); // 是否展示Nav
    useEffect(() => {
        setShowNav(needNav.includes(pathname));
    }, [pathname])

    return (
        <>
            <ConfigProvider locale={zhCN} primaryColor={'#007fff'}>
                <Switch>
                    {routes.map(route => <Route exact key={route.path} path={route.path}>
                        <route.component/>
                    </Route>)}
                </Switch>
            </ConfigProvider>
            <NavBar showNav={showNav}/>
        </>
    )
}

export default App
