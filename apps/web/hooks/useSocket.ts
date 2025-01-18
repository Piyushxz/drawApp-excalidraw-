import { useEffect, useState } from "react"
import { ws_URL } from "../config"

export const useSocket = ()=>{
    const [socket,setSocket] = useState<WebSocket>()
    const [loading,setLoading] = useState(true)
    useEffect(()=>{
        const ws = new WebSocket(`${ws_URL}`)

        ws.onopen=()=>{
            setLoading(false)
            setSocket(ws)
        }
    },[])

    return{socket,loading}
}