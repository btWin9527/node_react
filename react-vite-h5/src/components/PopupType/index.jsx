import React, {forwardRef, useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Popup, Icon} from 'zarm';
import cx from 'classnames';

import {get} from "@/utils";
import s from './style.module.less';

// forwardRef 用于拿到父组件传入的ref属性，这样在父组件便能通过ref控制子组件
const PopupType = forwardRef(({onSelect}, ref) => {
    const [show, setShow] = useState(false); // 组件的显示与隐藏
    const [active, setActive] = useState('all'); // 激活的type
    const [expense, setExpense] = useState([]); // 支出类型标签
    const [income, setIncome] = useState([]); // 收入类型标签

    useEffect(async () => {
        // 请求标签接口放在弹窗内，这个弹窗可能会被复用，所以请求如果放在外面，会造成代码冗余
        const {data: {list}} = await get('/api/type/list');
        setExpense(list.filter(i => i.type === 1));
        setIncome(list.filter(i => i.type === 2));
    }, []);

    // 处理ref
    if (ref) {
        ref.current = {
            // 暴露在外部的方法
            show: () => {
                setShow(true)
            },
            close: () => {
                setShow(false)
            }
        }
    }

    const choseType = (item) => {
        setActive(item.id);
        setShow(false);
        onSelect(item);
    }

    return (
        <Popup
            visible={show}
            direction="bottom"
            onMaskClick={() => setShow(false)}
            destroy={false}
            mountContainer={() => document.body}
        >
            <div className={s.popupType}>
                <div className={s.header}>
                    请选择类型
                    <Icon type="wrong" className={s.cross} onClick={() => setShow(false)}/>
                </div>
                <div className={s.content}>
                    <div onClick={() => choseType({id: 'all'})}
                         className={cx({[s.all]: true, [s.active]: active == 'all'})}>全部类型
                    </div>
                    <div className={s.title}>支出</div>
                    <div className={s.expenseWrap}>
                        {
                            expense.map((item, index) => <p key={index} onClick={() => choseType(item)}
                                                            className={cx({[s.active]: active == item.id})}>{item.name}</p>)
                        }
                    </div>
                    <div className={s.title}>收入</div>
                    <div className={s.incomeWrap}>
                        {
                            income.map((item, index) => <p key={index} onClick={() => choseType(item)}
                                                           className={cx({[s.active]: active == item.id})}>{item.name}</p>)
                        }
                    </div>
                </div>
            </div>
        </Popup>
    )
});

PopupType.propTypes = {
    onSelect: PropTypes.func
}


export default PopupType;