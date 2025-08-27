import { Baseline, Hand } from "lucide-react"
import { iconType } from "."
export const Text = (props:iconType)=>{
    return(
        <div onClick={props.onClick}
    className={`md:p-3 p-1 rounded-lg ${props.selectedTool === "text" ? " border border-gray-600 " :""} hover:bg-gray-600/30`}>
                <Baseline className="text-white size-4"/>
        </div>
    )
}