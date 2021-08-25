import React from 'react';
import {Button} from 'zarm';
import style from './style.module.less';

export default function Index() {
    return (
        <div className={style.index}>
            <span>样式</span>
            <Button theme="primary">测试</Button>
        </div>
    )
}