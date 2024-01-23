interface ModifiableListProps 
{
    title:String
    listItems:Array<{label:String,value:String|object|number}>
    onDeleteFromListHandler:()=>any
    onEditFromListHandler:()=>any
}

export type {ModifiableListProps}