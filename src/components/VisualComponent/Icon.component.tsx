import React from "react"
import { IconProps } from "../../Props/Icon.props"

const Icon = (icon:IconProps) =>
{      
    return (
        <>
            <img src={icon.path} alt="Icon" className={"min-w-[15px] rounded-sm"}
            style={{width:icon.widthPx?.toString() +"px"}} />
        </>
    )
}

export default Icon