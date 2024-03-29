import React, { useEffect, useState } from 'react';

//Custom components
import Button from './Button.component.tsx';

//Props
import { ModifiableListProps } from '../../props/ModifiableList.props.tsx';
import { useTranslation } from 'react-i18next';

const ModifiableList = (modifiable_list: ModifiableListProps) => {

    const [modifiableList, setModifiableList] = useState<ModifiableListProps>(modifiable_list);

    const { t } = useTranslation();

    useEffect(() => {
        setModifiableList(Object.assign({}, modifiable_list));
    }, [modifiable_list]);
    return (
        <div>
            <h3 className='text-left mb-3 font-bold text-xl'>{modifiableList.title}</h3>
            <table className='w-[100%] border-separate'>
                <tr className="bg-slate-600 text-white text-center">
                    <th className='p-2 '>
                        {t("table.label")}
                    </th>
                    <th colSpan={(!modifiableList.notEditable)?2:1}>
                        {t("table.action")}
                    </th>
                </tr>
                {
                    (modifiableList.list_items.length > 0) ?
                        modifiableList.list_items.map((item, i) => {
                            console.log(item.value)
                            return (<>
                                <tr className={"-4 shadow-sm " + ((i + 1) % 2 === 0) ? "bg-slate-300" : "bg-slate-200"}
                                    style={{ backgroundColor: ((i + 1) % 2 === 0) ? "rgb(203 213 225 / var(--tw-bg-opacity))" : "rgb(226 232 240 / var(--tw-bg-opacity)" }}>
                                    <td>
                                        {item.label}
                                    </td>
                                    {
                                        (!modifiableList.notEditable) ?
                                            <td>
                                                <div className='flex p-2 justify-center'>
                                                    <Button label='Edit' type='Edit' on_click_handler={() => {
                                                        console.log(item.value)
                                                        if (modifiableList.edit_from_list_handler && modifiableList.edit_from_list_handler(item.value) === true) {

                                                            //let newModList = JSON.parse(JSON.stringify(modifiableList));
                                                            //TODO edit
                                                            //setModifiableList(newModList);
                                                        }
                                                    }}></Button>
                                                </div>
                                            </td>:null
                                }

                                    <td>
                                        <div className='flex justify-center'>
                                            <Button label='Delete' type='Delete' on_click_handler={() => {
                                                if (modifiableList.delete_from_list_handler(item.value) === true) {
                                                    let newModList = JSON.parse(JSON.stringify(modifiableList));
                                                    newModList.list_items = newModList.list_items.filter((i) => {
                                                        console.log(i)
                                                        if (JSON.stringify(i.value) !== JSON.stringify(item.value))
                                                            return i;
                                                    })
                                                    setModifiableList(newModList);
                                                }
                                            }}></Button>
                                        </div>
                                    </td>
                                </tr>
                            </>)
                        }) :
                        <tr>
                            <td colSpan={3}>
                                <p >{t("list.empty")}</p>
                            </td>
                        </tr>
                }
            </table>
        </div>
    );
};

export default ModifiableList;
