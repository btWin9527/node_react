import React from 'react';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {ConfigProvider} from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';

import routes from "@/router";

function App() {

    return (
        <Router>
            <ConfigProvider locale={zhCN} primaryColor={'#007fff'}>
                <Switch>
                    {routes.map(route => <Route exact key={route.path} path={route.path}>
                        <route.component/>
                    </Route>)}
                </Switch>
            </ConfigProvider>
        </Router>
    )
}

export default App
