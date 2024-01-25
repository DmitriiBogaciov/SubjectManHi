import { CardProps } from "./Card.props"

interface GridCardProps
{
    card_items?:Array<CardProps>
    //Optional parameters with permissions
    permissions?:Array<string>
}

export type {GridCardProps}