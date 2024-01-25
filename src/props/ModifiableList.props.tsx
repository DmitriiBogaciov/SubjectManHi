interface ModifiableListProps 
{
    title:string
    listItems:Array<{label:string,value:string|object|number}>
    delete_from_list_handler:(value:string|object|number)=>boolean
    edit_from_list_handler:(value:string|object|number)=>boolean
}

export type {ModifiableListProps}