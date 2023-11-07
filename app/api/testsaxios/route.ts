import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'
import { HttpProxyAgent } from "http-proxy-agent";

const api = axios.create({
    baseURL:process.env.OPENAI_API_URL,
    headers: {
        "Content-Type":"application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    httpAgent:new HttpProxyAgent(process.env.SOCKS_PROXY!)
})

export async function POST(request:NextRequest){
    
    const data = await api.post('chat/completions',{
        "model": "gpt-3.5-turbo",
        "messages": [
          {
            "role": "system",
            "content": "You are a helpful assistant."
          },
          {
            "role": "user",
            "content": "Hello!"
          }
        ],
        max_tokens:1024
      })
      return NextResponse.json(JSON.stringify(data))
    
    
}