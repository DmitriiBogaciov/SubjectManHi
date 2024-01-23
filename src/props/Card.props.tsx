import { CardProps as CardProps_react } from "react-bootstrap"

interface CardProps extends CardProps_react
{
    cursorEffect:"onHover",
    value?:object
}

export type {CardProps}