import { EraserIcon } from "lucide-react"
import { iconStyles } from "."
import { iconType } from "."


export const Eraser = (props:iconType) =>{
    return(
        <div onClick={props.onClick}
        className={`p-3 rounded-lg ${props.selectedTool === "eraser" ? " border border-gray-600 " :" hover:bg-gray-600/30"} `}>

            <EraserIcon className="text-white size-4" />
            </div>



    )
}