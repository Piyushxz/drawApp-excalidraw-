"use client"
import axios from "axios"
import { getSession } from "next-auth/react"
import { useEffect, useState } from "react"


export const useGetRooms =  ()=>{

    const [roomData,setRoomData] = useState([])


    useEffect(()=>{

        async function  getRooms(){
            const session = await getSession()


            const response = await axios.get("http://13.235.113.13:3008/rooms",{
                headers:{
                    token: session?.accessToken
                }
            })
            console.log(response)
            setRoomData(response.data.rooms)
        }

       const intervalId = setInterval(getRooms,5000) 

       return()=>{
        clearInterval(intervalId)
       }

    },[])

    return {roomData}
}