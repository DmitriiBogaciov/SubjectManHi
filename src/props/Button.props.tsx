import { IconProps } from "./Icon.props"

interface ButtonProps
{
    label:string,
    onClickHandler:() => any,
    type:"Edit"| "Delete" | "Default" | "Submit",
    iconBefore?:IconProps
}

export type{ButtonProps}