import React, {useEffect, useRef, useState} from 'react';
import {Icon, Progress} from 'zarm';
import cx from 'classnames';
import dayjs from 'dayjs';
import {get, typeMap} from '@/utils'
import CustomIcon from '@/components/CustomIcon'
import PopupDate from '@/components/PopupDate'
import s from './style.module.less';

let proportionChart = null; // 存放echart初始化返回实例

const Data = () => {
    const monthRef = useRef();
    const [currentMonth, setCurrentMonth] = useState(dayjs().format('YYYY-MM'));
    const [totalType, setTotalType] = useState('expense'); // 收入或支出类型
    const [totalExpense, setTotalExpense] = useState(0); // 总支出
    const [totalIncome, setTotalIncome] = useState(0); // 总收入
    const [expenseData, setExpenseData] = useState([]); // 支出数据
    const [incomeData, setIncomeData] = useState([]); // 收入数据
    const [pieType, setPieType] = useState('expense'); // 饼图的「收入」和「支出」控制

    useEffect(() => {
        getData();
        return () => {
            // 组件卸载的时候，释放图标实例。clear 只是将其清空不会释放
            proportionChart.dispose();
        }
    }, [currentMonth]);

    // 绘制饼图
    const setPieChart = (data) => {
        if (window.echarts) {
            // 初始化饼图，返回实例。
            proportionChart = echarts.init(document.getElementById('proportion'));
            proportionChart.setOption({
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                // 图例
                legend: {
                    data: data.map(item => item.type_name)
                },
                series: [
                    {
                        name: '支出',
                        type: 'pie',
                        radius: '55%',
                        data: data.map(item => {
                            return {
                                value: item.number,
                                name: item.type_name
                            }
                        }),
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        }
    }

    const getData = async () => {
        const {data} = await get(`/api/bill/data?date=${currentMonth}`);
        // 总收支
        setTotalExpense(data.total_expense);
        setTotalIncome(data.total_income);
        // 过滤支出和收入
        const expense_data = data.total_data.filter(item => item.pay_type === 1).sort((a, b) => b.number - a.number); // 过滤出账单为支出类型
        const income_data = data.total_data.filter(item => item.pay_type === 2).sort((a, b) => b.number - a.number); // 过滤出账单为支出类型
        setExpenseData(expense_data);
        setIncomeData(income_data);
        // 绘制饼图
        setPieChart(pieType === 'expense' ? expense_data : income_data);
    }

    const changePieType = (type) => {
        setPieType(type);
        // 重新绘制饼图
        setPieChart(type === 'expense' ? expenseData : incomeData);
    }

    const changeTotalType = (value) => {
        setTotalType(value);
    }

    const monthShow = () => {
        monthRef.current && monthRef.current.show();
    }

    const monthSelect = (item) => {
        setCurrentMonth(item);
    }

    return (
        <div className={s.data}>
            <div className={s.total}>
                <div className={s.time} onClick={monthShow}>
                    <span>{currentMonth}</span>
                    <Icon className={s.date} type="date"/>
                </div>
                <div className={s.title}>共支出</div>
                <div className={s.expense}>¥{totalExpense}</div>
                <div className={s.income}>共收入¥{totalIncome}</div>
            </div>
            <div className={s.structure}>
                <div className={s.head}>
                    <span className={s.title}>收支构成</span>
                    <div className={s.tab}>
                        <span onClick={() => changeTotalType('expense')}
                              className={cx({[s.expense]: true, [s.active]: totalType === 'expense'})}>支出</span>
                        <span onClick={() => changeTotalType('income')}
                              className={cx({[s.income]: true, [s.active]: totalType === 'income'})}>收入</span>
                    </div>
                </div>
                <div className={s.content}>
                    {
                        (totalType === 'expense' ? expenseData : incomeData).map(item => (
                            <div key={item.type_id} className={s.item}>
                                <div className={s.left}>
                                    <div className={s.type}>
                                        <span className={cx({
                                            [s.expense]: totalType === 'expense',
                                            [s.income]: totalType === 'income'
                                        })}>
                                            <CustomIcon type={item.type_id ? typeMap[item.type_id].icon : 1}/>
                                        </span>
                                        <span className={s.name}>{item.type_name}</span>
                                    </div>
                                    <div className={s.progress}>¥{Number(item.number).toFixed(2) || 0}</div>
                                </div>
                                <div className={s.right}>
                                    <div className={s.percent}>
                                        <Progress
                                            shape="line"
                                            percent={Number((item.number / Number(totalType === 'expense' ? totalExpense : totalIncome)) * 100).toFixed(2)}
                                            theme='primary'
                                        />
                                    </div>
                                </div>
                            </div>))
                    }
                    {/* 这是用于放置饼图的 DOM 节点 */}
                    <div className={s.proportion}>
                        <div className={s.head}>
                            <span className={s.title}>收支构成</span>
                            <div className={s.tab}>
                                <span onClick={() => changePieType('expense')}
                                      className={cx({[s.expense]: true, [s.active]: pieType === 'expense'})}>支出</span>
                                <span onClick={() => changePieType('income')}
                                      className={cx({[s.income]: true, [s.active]: pieType === 'income'})}>收入</span>
                            </div>
                        </div>
                        {/* 这是用于放置饼图的 DOM 节点 */}
                        <div id="proportion"></div>
                    </div>
                </div>
            </div>
            <PopupDate onSelect={monthSelect} ref={monthRef} mode="month"/>
        </div>
    )
}


export default Data;