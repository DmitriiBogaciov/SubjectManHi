interface ListItemProps
{
    label:string,
    value?:object | string | number,
    onClick?:(value?:object | string | number)=>any
}

export {ListItemProps}