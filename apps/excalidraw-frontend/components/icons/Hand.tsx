import { Hand } from "lucide-react"
import { iconType } from "."
export const HandGrab = (props:iconType)=>{
    return(
        <div onClick={props.onClick}
        className={`md:p-3 p-1 rounded-lg ${props.selectedTool === "hand" ? " border border-gray-600 " :""} hover:bg-gray-600/30`}>
                <Hand className="text-white size-4"/>
        </div>
    )
}