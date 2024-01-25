import { IconProps } from "./Icon.props"

interface ButtonProps
{
    label:string,
    on_click_handler:() => any,
    type:"Edit"| "Delete" | "Default" | "Submit",
    icon_before?:IconProps
}

export type{ButtonProps}