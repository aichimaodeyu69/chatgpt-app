import { useAppContext } from "@/components/AppContext"
import MarkdownSlice from "@/components/common/Markdown"
import { ActionType } from "@/reducers/AppReducer"
import { useEffect } from "react"
import { SiOpenai } from "react-icons/si"


export default function MessageList() {
    const {
        state:{messageList,streamingId,selectedChat}
        ,dispatch
    } = useAppContext()
    async function getData(chatId:string){
        const response = await fetch(`/api/message/list?chatId=${selectedChat?.id}`,{
            method:"GET",
        })
        if(!response.ok){
            console.log(response.statusText)
            return
        }
        const {data}  = await response.json()
        dispatch({type:ActionType.UPDATE,field:"messageList",value:data.list})
    }

    useEffect(()=>{
        if(selectedChat){
            getData(selectedChat.id)
        }else{
            dispatch({type:ActionType.UPDATE,field:"messageList",value:[]})
        }
    },[selectedChat])
    return (
        <div className="w-full pt-10 pb-48 dark:text-gray-300">
             <ul>
                {messageList.map((message) => {
                    console.log(message)
                    const isUser = message.role === "user"
                    return <li key={message.id}
                        className={`${isUser
                            ? "bg-white dark:bg-gray-800"
                            :"bg-gray-50 dark:bg-gray-700"}`}>
                        <div className="grid grid-cols-12 w-full max-w-4xl mx-auto flex space-x-6 px-4 py-6 text-lg">
                            <div className='col-span-1 mx-auto text-3xl leading-[1]'>
                                {isUser ? "😊" : <SiOpenai />}
                            </div>
                            <div className="flex-1 col-span-11">
                                <MarkdownSlice>
                                {`${message.content}${
                                        message.id === streamingId ? "▍" : ""
                                    }`}

                                </MarkdownSlice>
                                
                            </div>
                        </div>
                    </li>
                })}
            </ul>
        </div>
    )
}