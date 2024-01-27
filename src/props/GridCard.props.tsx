import { CardProps } from "./Card.props"
interface GridCardProps
{
    card_items?:Array<CardProps>
    shown_when_empty?:boolean,
    //Optional parameters with permissions
    permissions?:Array<string>
}

export type {GridCardProps}