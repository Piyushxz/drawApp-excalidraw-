import { PencilIcon } from "lucide-react"
import { iconStyles } from "."
import { iconType } from "."
export default function Pencil(props:iconType){
    return(
        <div onClick={props.onClick}
        
         className={`md:p-3 p-1 rounded-lg ${props.selectedTool === "pencil" ? " border border-gray-600" :" hover:bg-gray-600/30"} `}>
               <PencilIcon className="text-white size-4"/>
        
        </div>


     
    )
}