import { RectangleHorizontalIcon, } from "lucide-react"
import { iconType } from "."
export default function Rectangle(props:iconType){
    
    return(
        <div onClick={props.onClick}
        className={`p-3 rounded-lg ${props.selectedTool === "rect" ? " border border-gray-600" :" hover:bg-gray-600/30"} `}>
            <RectangleHorizontalIcon className="text-white size-4"/>
        </div>
        )
}