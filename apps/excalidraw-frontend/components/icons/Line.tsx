import { iconStyles } from "."
import { iconType } from "."
export const Line = (props : iconType)=>{
    return(
        <div onClick={props.onClick}
        className={`p-1 rounded-lg ${props.selectedTool === "line" ? " border border-black " :""}`}
        >
            <svg className={`${iconStyles[props.size]}`}
            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" >
            <path d="M5 12h14"/></svg>
        </div>
    )
}