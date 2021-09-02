import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {TabBar} from "zarm";
import {useHistory,useLocation} from "react-router-dom";
import s from "./style.module.less";
import CustomIcon from '../CustomIcon'

const NavBar = ({showNav}) => {
    const [activeKey, setActiveKey] = useState('/');
    const history = useHistory();
    const location = useLocation(); // 拿到location实例
    const {pathname} = location; // 获取当前路径

    useEffect(() => {
        setActiveKey(pathname);
    },[pathname]);

    const changeTab = (path) => {
        setActiveKey(path);
        history.push(path);
    }

    return (
        <TabBar visible={showNav} className={s.tab} activeKey={activeKey} onChange={changeTab}>
            <TabBar.Item itemKey="/" title="账单" icon={<CustomIcon type="zhangdan"/>}/>
            <TabBar.Item itemKey="/data" title="统计" icon={<CustomIcon type="tongji"/>}/>
            <TabBar.Item itemKey="/user" title="我的" icon={<CustomIcon type="wode"/>}/>
        </TabBar>
    )
}

NavBar.propTypes = {
    showNav: PropTypes.bool
}

export default NavBar;
