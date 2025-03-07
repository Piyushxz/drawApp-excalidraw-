import { CircleEllipsisIcon } from "lucide-react"
import { iconStyles } from "."
import { iconType } from "."
export default function Circle(props:iconType){
    return(
        <div onClick={props.onClick}
        className={`p-3 rounded-lg ${props.selectedTool === "circle" ? " border border-gray-600 " :" hover:bg-gray-600/30"} `}>
            <CircleEllipsisIcon className="text-white size-4"/>
        </div>
    )
}