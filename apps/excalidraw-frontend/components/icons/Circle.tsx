import {  CircleIcon } from "lucide-react"
import { iconType } from "."
export default function Circle(props:iconType){
    return(
        <div onClick={props.onClick}
        className={`md:p-3 p-1 rounded-lg ${props.selectedTool === "circle" ? " border border-gray-600 " :" hover:bg-gray-600/30"} `}>
            <CircleIcon className="text-white size-5 md:size-4"/>
        </div>
    )
}