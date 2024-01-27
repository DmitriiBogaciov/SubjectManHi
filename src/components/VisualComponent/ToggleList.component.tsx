import React, { useEffect, useState } from "react";

//Props
import { ListItemProps } from "../../props/ListItem.props.tsx";
import { useTranslation } from "react-i18next";

const ToggleList = ({ title, list_items, is_open }: { title: string, list_items: Array<ListItemProps>, is_open: boolean }) => {
    const [listItems, setListItems] = useState<Array<ListItemProps>>(list_items);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const {t} = useTranslation();

    useEffect(() => {
        setListItems([...list_items]);
        setIsOpen(is_open);
        console.log(list_items)
    }, [list_items]);

    useEffect(() => {
        setIsOpen(is_open);
    }, [is_open]);

    return (

        <div className="">
            {(listItems.length > 0) ?
                
                <>
                    <div className={`bg-slate-500 relative z-10 rounded-t-md transition-[200ms] cursor-pointer p-4 ${(!isOpen) ? "rounded-b-md" : "rounded-b-none"}`} onClick={() => {
                        setIsOpen(!isOpen);
                    }}>
                        <h3 className="text-left font-bold text-xl">{title}</h3>
                    </div>
                    <div className={(isOpen) ? "drop-down-effect relative z-0" : "hidden"}>
                        <ul className="">
                            {
                                listItems.map((item, i) => {
                                    return (
                                        <li onClick={() => { (item.onClick) ? item.onClick(item.value) : "" }} className={`text-left p-2 ${((i + 1) % 2 === 0) ? "bg-slate-200" : "bg-slate-400"} ${(item.onClick) ? "cursor-pointer hover:scale-105 transition-[200ms]" : ""}`}>
                                            {item.label}
                                        </li>
                                    )
                                })
                            }
                        </ul>
                    </div>
                </> : 
                <p>{t("list.empty")}</p>
            }
        </div>

    )
}

export default ToggleList;
