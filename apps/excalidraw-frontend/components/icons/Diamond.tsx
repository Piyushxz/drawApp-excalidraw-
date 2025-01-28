import { iconStyles } from ".";
import { iconType } from ".";

export default function Diamond(props: iconType) {
  return (
    <div onClick={props.onClick}
    className={`p-1 rounded-lg ${props.selectedTool === "diamond" ? " border border-black " :""}`}>

    
<svg className={`${iconStyles[props.size]}`}
 xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"/>
</svg>
    </div>

  );
}
