import React, {useState, useCallback} from 'react';
import {Cell, Input, Button, Checkbox, Toast} from 'zarm';
import Captcha from 'react-captcha-code';
import cx from 'classnames';
import {useHistory} from 'react-router-dom';

import {post} from "@/utils";
import CustomIcon from '@/components/CustomIcon';
import s from './style.module.less';

const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [verify, setVerify] = useState('');
    const [captcha, setCaptcha] = useState('');
    const [type, setType] = useState('login');
    const history = useHistory();

    // 切换验证码 -- useCallback缓存函数，避免表单修改重新渲染验证码组件
    const handleChange = useCallback((captcha) => {
        setCaptcha(captcha);
    }, []);

    // 登录逻辑处理
    const handleLogin = async () => {
        try {
            const {data} = await post('/api/user/login', {
                username, password
            });
            // 将 token 写入 localStorage
            localStorage.setItem('token', data.token);
            Toast.show('登录成功');
            history.push('/index');

        } catch (e) {
            Toast.show('系统错误');
        }
    }

    // 注册逻辑处理
    const handleRegister = async () => {
        try {
            const {data} = await post('/api/user/register', {
                username,
                password
            });
            Toast.show('注册成功');
            // 自动切换到登录模块
            setType('login');
        } catch (e) {
            Toast.show('系统错误');
        }
    }

    // 渲染验证表单
    const renderVerifyForm = () => {
        return (
            <Cell icon={<CustomIcon type="mima"/>}>
                <Input clearable type="text" placeholder="请输入验证码" onChange={(value) => setVerify(value)}/>
                <Captcha charNum={4} onChange={handleChange}/>
            </Cell>
        )
    }

    // 渲染阅读协议
    const renderReadAgreement = () => {
        return (
            <div className={s.agree}>
                <Checkbox/>
                <label className="text-light">阅读并同意<a>《掘掘手札条款》</a></label>
            </div>
        )
    }

    // 表单提交
    const onsubmit = () => {
        if (!username) return Toast.show('请输入账号');
        if (!password) return Toast.show('请输入密码');
        // 登录
        if (type === 'login') {
            handleLogin();
        } else {
            if (!verify) return Toast.show('请输入验证码');
            if (verify !== captcha) return Toast.show('验证码错误');
            handleRegister();
        }
    }

    return (
        <div className={s.auth}>
            <div className={s.head}/>
            <div className={s.tab}>
                <span className={cx({[s.active]: type === 'login'})} onClick={() => setType('login')}>登录</span>
                <span className={cx({[s.active]: type === 'register'})} onClick={() => setType('register')}>注册</span>
            </div>
            <div className={s.form}>
                <Cell icon={<CustomIcon type="zhanghao"/>}>
                    <Input clearable type="text" placeholder="请输入账号" onChange={(value) => setUsername(value)}/>
                </Cell>
                <Cell icon={<CustomIcon type="mima"/>}>
                    <Input clearable type="password" placeholder="请输入密码" onChange={(value) => setPassword(value)}/>
                </Cell>
                {type === 'register' ? renderVerifyForm() : null}
            </div>
            <div className={s.operation}>
                {type === 'register' ? renderReadAgreement() : null}
                <Button block theme="primary" onClick={onsubmit}>{type === 'login' ? '登录' : '注册'}</Button>
            </div>
        </div>
    )
}

export default Login;