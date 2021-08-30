import React, {useState, useCallback} from 'react';
import {Cell, Input, Button, Checkbox, Toast} from 'zarm';
import Captcha from 'react-captcha-code';
import cx from 'classnames';

import {post} from "@/utils";
import CustomIcon from '@/components/CustomIcon';
import s from './style.module.less';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verify, setVerify] = useState('');
    const [captcha, setCaptcha] = useState('');

    const handleChange = useCallback((captcha) => {
        console.log(captcha, 'captcha')
        setCaptcha(captcha);
    }, []);

    const onsubmit = async () => {
        if (!username) return Toast.show('请输入账号');
        if (!password) return Toast.show('请输入密码');
        if (!verify) return Toast.show('请输入验证码');
        if (verify !== captcha) return Toast.show('验证码错误');
        try{
            const {data} = await post('/api/user/register', {
                username,
                password
            });
            Toast.show('注册成功');
        }catch (e) {
            Toast.show('系统错误');
        }

    }

    return (
        <div className={s.auth}>
            <div className={s.head}/>
            <div className={s.tab}>
                <span>注册</span>
            </div>
            <div className={s.form}>
                <Cell icon={<CustomIcon type="zhanghao"/>}>
                    <Input clearable type="text" placeholder="请输入账号" onChange={(value) => setUsername(value)}/>
                </Cell>
                <Cell icon={<CustomIcon type="mima"/>}>
                    <Input clearable type="password" placeholder="请输入密码" onChange={(value) => setPassword(value)}/>
                </Cell>
                <Cell icon={<CustomIcon type="mima"/>}>
                    <Input clearable type="text" placeholder="请输入验证码" onChange={(value) => setVerify(value)}/>
                    <Captcha charNum={4} onChange={handleChange}/>
                </Cell>
            </div>
            <div className={s.operation}>
                <div className={s.agree}>
                    <Checkbox/>
                    <label className="text-light">阅读并同意<a>《掘掘手札条款》</a></label>
                </div>
                <Button block theme="primary" onClick={onsubmit}>注册</Button>
            </div>
        </div>
    )
}

export default Login;