'use client'
import { Button } from "antd";
import React from "react";
import { useState, createContext, useContext } from "react";


const MyContext = createContext()
function Parent() {
    const { count, setCount } = useContext(MyContext)
    return (
        <>
            <div>父组件-{count}</div>
            <Child />
        </>
    )
}

function Child() {
    const { count, setCount } = useContext(MyContext)
    return (
        <>
            <div>子组件-{count}</div>
            <Button onClick={() => setCount(count + 1)}>+</Button>
        </>
    )
}

export default function useContextApp() {

    const [count, setCount] = useState(0)
    return (
        <>
            <MyContext.Provider value={{ count, setCount }}>
                <div>根组件-{count}</div>
                <Parent />
            </MyContext.Provider>
        </>
    )
}