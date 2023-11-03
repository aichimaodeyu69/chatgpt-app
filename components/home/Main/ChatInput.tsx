import Button from '@/components/common/Button'
import { MdRefresh } from 'react-icons/md'
import { PiLightningFill ,PiStopBold } from 'react-icons/pi'
import TextAreaAutoSize from 'react-textarea-autosize'
import { FiSend } from 'react-icons/fi'
import { useRef, useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import { useAppContext } from '@/components/AppContext'
import { Message, MessageRequestBody } from '@/types/chat'
import { ActionType } from '@/reducers/AppReducer'

export default function ChatInput() {
    const [messageText, setMessageText] = useState("")
    const stopRef =  useRef(false)
    const {
        state:{messageList,currentModel,streamingId},dispatch
    } = useAppContext()

    async function send(){
        const message: Message = {
            id: uuidv4(),
            role: "user",
            content:messageText
        }
        dispatch({ type: ActionType.ADD_MESSAGE, message })
        const messages = messageList.concat([message])
        doSend(messages)
    }
    async function resend() {
        const messages = [...messageList]
        if (messages.length !== 0 && messages[messages.length - 1].role === "assistant")
        {
            dispatch({
                type: ActionType.REMOVE_MESSAGE,
                message:messages[messages.length-1]
            })
            messages.splice(messages.length-1,1)
        }
        doSend(messages)
    }

    async function doSend(messages:Message[]) {
        
        
        const body: MessageRequestBody = { messages: messages, model: currentModel }
        
        setMessageText("")
        const controller = new AbortController()
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            signal:controller.signal,
            body:JSON.stringify(body)
        })
        if (!response.ok) {
            console.log(response.statusText)
            return
        }
        if (!response.body) {
            console.log("body error")
            return
        }
        const responseMessage: Message = {
            id: uuidv4(),
            role: "assistant",
            content:""
        }
        dispatch({ type:ActionType.ADD_MESSAGE,message:responseMessage})   
        dispatch({
            type: ActionType.UPDATE,
            field: "streamingId",
            value:responseMessage.id
        })
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let done = false
        let content = ""
        while (!done) {
            if (stopRef.current) {
                stopRef.current = false
                controller.abort()
                break
            }
            const result = await reader.read()
            done = result.done
            const chunk = decoder.decode(result.value)
            console.log(chunk)
            content += chunk
            dispatch({ type: ActionType.UPDATE_MESSAGE, message: { ...responseMessage ,content:content} })
        }
        dispatch({
            type: ActionType.UPDATE,
            field: "streamingId",
            value:""
        })
        setMessageText("")
        
    }
    return <div className="absolute bottom-0 inset-x-0 bg-gradient-to-b from-[rgba(255,255,255,0)] from-[13.94%] to-[#fff] to-[54.73%] pt-10 dark:from-[rgba(53,55,64,0)] dark:to-[#353740] dark:to-[58.85%]">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center px-4 space-y-4">
            {messageList.length !== 0 &&
                (streamingId!== ""
                ? (<Button
                    onClick={() => {
                        stopRef.current = true
                    }}
                    icon={PiStopBold} variant='primary' className='font-medium'>停止生成</Button>)
                : (<Button icon={MdRefresh}
                    onClick={() => {
                        resend()
                    }}
                    variant='primary' className='font-medium'>重新生成</Button>)
                )
            }
            
            <div className='flex items-end w-full border border-black/10 dark:border-gray-800/50 bg-white dark:bg-gray-700 rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] py-4'  >
                <div className="mx-3 mb-2.5">
                    <PiLightningFill />
                </div>
                <TextAreaAutoSize
                    className='outline-none flex-1 max-h-64 mb-1.5 bg-transparent text-black dark:text-white resize-none border-0'
                    placeholder='输入一条消息...'
                    rows={1}
                    value={messageText}
                    onChange={(e) => [
                        setMessageText(e.target.value)
                    ]}
                />
                <Button
                    className='mx-3 !rounded-lg'
                    icon={FiSend} variant='primary'
                    disabled={messageText.trim()===""||streamingId!=""}
                    onClick={send}
                />
            </div>
            <footer className='text-center text-sm text-gray-700 dark:text-gray-300 px-4 pb-6'>
                {new Date().getFullYear()}&nbsp;
                <a className='font-medium py-[1px] border-b border-dotted border-black/60 hover:border-black/0 dark:border-gray-200 dark:hover:border-gray-200/0 animated-underline'
                    href="https://halo.sealks.cn" target="_blank">海豹小屋</a>
            </footer>
        </div>
    </div>
}