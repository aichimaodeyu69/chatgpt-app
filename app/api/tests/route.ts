import { NextRequest, NextResponse } from "next/server";
// import fetch from 'node-fetch'
// import {HttpProxyAgent} from 'http-proxy-agent'

// const HttpProxyAgent = require('http-proxy-agent');
export async function POST(request:NextRequest){
    const body = await request.json()
    const response = await fetch("https://api.openai.com/v1/chat/completions",{
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body:JSON.stringify(body),
    })
    if (!response.ok) {
        return
    }
    const data = await response.json()
    return NextResponse.json({code:0,data:data})
    
}