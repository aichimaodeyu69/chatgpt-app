'use client'
import { useReducer } from "react"
import { Button } from 'antd';
import { StyleProvider } from '@ant-design/cssinjs';


/**
 * 组件
 *  状态数据
 *  操作状态数据的方法
 * 使用
 *  状态数据
 *  出发方法
 * 
 */
function useCount() {
    /*
        把操作状态数据的代码进行调整
        state 代表操作之前的，原来的值
        action  = {type:具体的操作名称，payload：操作附带的值。}
    */
    function reducer(state: any, action: any) {
        switch (action.type) {
            case 'inc':
                return {
                    ...state,
                    count: state.count + action.payload
                }
            case 'dec':
                return {
                    ...state,
                    count: state.count - action.payload
                }
            case 'rename':
                return {
                    ...state,
                    name: action.payload
                }
            default:
                return state
        }
    }
    return useReducer(reducer, { name: '青苹果', count: 100 })
}

export default function useReducerApp() {
    const [fruit, dispatch] = useCount()


    return (
        <>
            <StyleProvider hashPriority="high">
                <div className="text-3xl" >{fruit.name}-{fruit.count}</div>

                <div className="space-x-3">
                    <Button type="primary" onClick={() => dispatch({ type: 'inc', payload: 1 })} className="text-gray-800">加</Button>
                    <Button type="primary" danger ghost onClick={() => dispatch({ type: 'dec', payload: 1 })}>减</Button>
                    <Button type="primary" className="text-gray-800" onClick={() => dispatch({ type: 'rename', payload: '红富士' })} >改名</Button>
                </div>
            </StyleProvider>


        </>
    )
}