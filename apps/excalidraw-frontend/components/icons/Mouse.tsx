import { MousePointer } from "lucide-react"
import { iconType } from "."
export const Mouse = (props:iconType)=>{
    return(
        <div onClick={props.onClick}
        className={`p-3 rounded-lg ${props.selectedTool === "mouse" ? " border border-gray-600 " :""} hover:bg-gray-600/30`}>
                <MousePointer className="text-white"/>
        </div>
    )
}