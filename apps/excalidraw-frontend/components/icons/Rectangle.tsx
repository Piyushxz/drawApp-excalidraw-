import { iconStyles } from "."
import { iconType } from "."
export default function Rectangle(props:iconType){
    return(
        <div onClick={props.onClick}
        className={`p-1 rounded-lg ${props.selectedTool === "rect" ? " border border-black " :""}`}>
        <svg className={`${iconStyles[props.size]} `}
         xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#434343"><path d="M200-280q-33 0-56.5-23.5T120-360v-240q0-33 23.5-56.5T200-680h560q33 0 56.5 23.5T840-600v240q0 33-23.5 56.5T760-280H200Zm0-80h560v-240H200v240Zm0 0v-240 240Z"/></svg>
        </div>
        )
}