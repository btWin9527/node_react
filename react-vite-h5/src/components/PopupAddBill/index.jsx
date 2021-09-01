import React, {forwardRef, useState, useRef, useEffect} from 'react';
import {Popup, Icon, Keyboard, Input, Toast} from "zarm";
import cx from 'classnames';
import dayjs from 'dayjs';

import CustomIcon from '../CustomIcon';
import PopupDate from "../PopupDate";
import s from './style.module.less';
import {get, typeMap, post} from "@/utils";

const PopupAddBill = forwardRef(({detail, onReload}, ref) => {
    const [show, setShow] = useState(false); // 内部控制弹窗显示隐藏
    const [payType, setPayType] = useState('expense'); // 支付类型
    const [date, setDate] = useState(new Date()); // 日期
    const [amount, setAmount] = useState(''); // 账单金额
    const [currentType, setCurrentType] = useState({}); // 当前选中账单类型
    const [expense, setExpense] = useState([]); // 支出类型数组
    const [income, setIncome] = useState([]); // 收入类型数组
    const [remark, setRemark] = useState(''); // 备注信息
    const [showRemark, setShowRemark] = useState(false); // 显示备注信息
    const dateRef = useRef(); // 时间组件ref
    const id = detail && detail.id; // 详情id

    useEffect(() => {
        if (detail && detail.id) {
            setPayType(detail.pay_type === 1 ? 'expense' : 'income');
            setCurrentType({
                id: detail.type_id,
                name: detail.type_name
            });
            setRemark(detail.remark);
            setAmount(detail.amount);
            setDate(dayjs(Number(detail.date) * 1000).$d);
        }
    }, [detail]);

    useEffect(async () => {
        const {data: {list}} = await get('/api/type/list');
        const _expense = list.filter(i => i.type === 1);
        const _income = list.filter(i => i.type === 2);
        setExpense(_expense);
        setIncome(_income);
        if (!id) {
            setCurrentType(_expense[0]);
        }
    }, []);

    if (ref) {
        ref.current = {
            show: () => {
                setShow(true)
            },
            close: () => {
                setShow(false)
            }
        }
    }

    // 切换type类型
    const changeType = (type) => {
        setPayType(type);
    }

    // 日期切换
    const selectDate = (val) => {
        setDate(val);
    }

    // 添加账单
    const addBill = async () => {
        if (!amount) {
            Toast('请输入具体金额');
            return;
        }
        const params = {
            amount: Number(amount).toFixed(2), // 账单金额
            type_id: currentType.id, // 账单种类id
            type_name: currentType.name, // 账单种类名称
            date: dayjs(date).unix(), // 日期
            pay_type: payType === 'expense' ? 1 : 2, // 账单类型
            remark: remark || '' // 备注
        }
        // 修改
        if (id) {
            params.id = id;
            const result = await post('/api/bill/update', params);
            Toast.show('修改成功');
        }
        // 新增
        else {
            const result = await post('/api/bill/add', params);
            // 重置数据
            setAmount('');
            setRemark('');
            setPayType('expense');
            setCurrentType(expense[0]);
            setDate(new Date());
            Toast.show('添加成功');
        }
        setShow(false);
        // onReload 方法为首页账单列表传进来的函数，当添加完账单的时候，执行 onReload 重新获取首页列表数据
        if (onReload) onReload();
    }

    // 监听输入框变化
    const handleMoney = (value) => {
        value = String(value);
        // 删除操作
        if (value === 'delete') {
            let _amount = amount.slice(0, amount.length - 1);
            setAmount(_amount);
            return;
        }
        // 确认操作
        if (value === 'ok') {
            addBill();
            return;
        }
        // 当输入.且存在.则不然继续字符串相加
        if (value === '.' && amount.includes('.')) return;
        // 小数点后保留两位，当超过两位时，不让其字符串继续相加。
        if (value !== '.' && amount.includes('.') && amount && amount.split('.')[1].length >= 2) return;
        setAmount(amount + value);
    }

    return (
        <Popup
            visible={show}
            direction="bottom"
            onMaskClick={() => setShow(false)}
            destroy={false}
            mountContainer={() => document.body}
        >
            <div className={s.addWrap}>
                {/*  右上角关闭弹窗  */}
                <header className={s.header}>
                    <span className={s.close} onClick={() => setShow(false)}><Icon type="wrong"/></span>
                </header>
                {/*  「收入」 和 「支出」类型切换  */}
                <div className={s.filter}>
                    <div className={s.type}>
                        <span onClick={() => changeType('expense')}
                              className={cx({[s.expense]: true, [s.active]: payType === 'expense'})}
                        >支出</span>
                        <span onClick={() => changeType('income')}
                              className={cx({[s.income]: true, [s.active]: payType === 'income'})}
                        >收入</span>
                    </div>
                    <div className={s.time} onClick={() => dateRef.current && dateRef.current.show()}>
                        {dayjs(date).format('MM-DD')} <Icon className={s.arrow} type="arrow-bottom"/>
                    </div>
                </div>
                <div className={s.money}>
                    <span className={s.sufix}>￥</span>
                    <span className={cx(s.amount, s.animation)}>{amount}</span>
                </div>
                <div className={s.typeWarp}>
                    <div className={s.typeBody}>
                        {/*  通过payType判断，展示收入账单类型，还是支出账单类型  */}
                        {
                            (payType === 'expense' ? expense : income).map(item => (
                                <div onClick={() => setCurrentType(item)} key={item.id} className={s.typeItem}>
                            <span className={cx({
                                [s.iconfontWrap]: true,
                                [s.expense]: payType === 'expense',
                                [s.income]: payType === 'income',
                                [s.active]: currentType.id === item.id
                            })}>
                                <CustomIcon className={s.iconfont} type={typeMap[item.id].icon}/>
                            </span>
                                    <span>{item.name}</span>
                                </div>))
                        }
                    </div>
                </div>
                <div className={s.remark}>
                    {
                        showRemark ?
                            <Input
                                autoHeight
                                showLength
                                maxLength={50}
                                type="text"
                                rows={3}
                                value={remark}
                                placeholder="请输入备注信息"
                                onChange={(val) => setRemark(val)}
                                onBlur={() => setShowRemark(false)}
                            /> :
                            <span onClick={() => setShowRemark(true)}>{remark || '添加备注'}</span>
                    }
                </div>
                <Keyboard type="price" onKeyClick={(value) => handleMoney(value)}/>
                <PopupDate ref={dateRef} onSelect={selectDate}/>
            </div>
        </Popup>
    )
})

export default PopupAddBill;