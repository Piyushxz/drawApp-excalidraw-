import { iconType } from "."
export const Arrow = (props:iconType)=>{
    return(
        <div onClick={props.onClick}
        className={`p-3 rounded-lg ${props.selectedTool === "arrow" ? " border border-gray-600 " :""} hover:bg-gray-600/30`}>
        <svg 
        xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F7F7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-move-right size-4">
            
            <path d="M18 8L22 12L18 16"/><path d="M2 12H22"/></svg>
        </div>
    )
}