import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";


//Components


//Custom components
import DigitalContentModalData from "../../data-component/Modals/DigitalContentModal.datacomponent.tsx";
import ModifiableList from "../ModifiableList.component.tsx";


//~~~Props~~~
import { DigitalContentDataProps } from "../../../props/nonVisual/DigitalContent.dataprops.tsx";
import { ModalDataProps } from "../../../props/nonVisual/Modal.dataprops.tsx";
import Button from "../Button.component.tsx";


const DigitalContentManager = ({ all_digitalContents, permissions_, delete_digitalContent_handler, edit_digitalContent_handler }:
    {
        all_digitalContents: Array<DigitalContentDataProps>, permissions_: Array<string>,
        delete_digitalContent_handler:  (digitalContent: DigitalContentDataProps) => boolean,
        edit_digitalContent_handler:  (digitalContent: DigitalContentDataProps) => boolean
    }) => {

    const [allDigitalContents, setAllDigitalContents] = useState<Array<DigitalContentDataProps>>(all_digitalContents);
    const [editingDigitalContent, setEditingDigitalContent] = useState<DigitalContentDataProps>();


    const [modListItems, setModListItems] = useState<Array<{ label: string, value: string | object | number }>>([])
    const [modal, setModal] = useState<ModalDataProps>({})

    const { t } = useTranslation();

    useEffect(() => {
        setAllDigitalContents(all_digitalContents);
        let newArray: Array<{ label: string, value: string | object | number }> = []
        for (let sp in allDigitalContents) {
            newArray.push({ label: allDigitalContents[sp].name, value: allDigitalContents[sp] })
        }
        setModListItems(newArray);
        console.log(modListItems)
    }, [all_digitalContents])

    const toggleModalHandler = (open:boolean) =>
    {
        let newModal = { ...modal };
        newModal.show = open;
        setModal(newModal);
    };

    return (

        <>
            <h1>{t("manager.digitalContent.title")}</h1>
            <div className="flex justify-end">
                <Button type="Submit" label={t("manager.digitalContent.createNew")} on_click_handler={()=>{
                    setEditingDigitalContent({_id:"",description:"",name:"",digitalContentIdList:[]});
                    toggleModalHandler(true);
                    }}></Button>
            </div>
            <div>
                <ModifiableList list_items={modListItems} title={t("manager.digitalContent.list")}
                    delete_from_list_handler={(value: string | object | number) => {
                        //Checking if incoming value is object with corresponding object
                        if (typeof value === "object" && "externalLink" in value)   
                        {
                          return delete_digitalContent_handler(value);
                        }                                                
                        return false;

                    }}
                    edit_from_list_handler={(value: string | object | number) => {
                        //Checking if incoming value is object with corresponding object
                        if (typeof value === "object" && "externalLink" in value) {
                                let newDigitalContent: DigitalContentDataProps = JSON.parse(JSON.stringify(value));
                                toggleModalHandler(true);
                                setEditingDigitalContent({ ...newDigitalContent })
                        }
                        return false;
                    }} />

                <DigitalContentModalData  modal_props={modal} editing_digitalContent_id={editingDigitalContent?._id}></DigitalContentModalData>
            </div>

        </>

    )
}

export default DigitalContentManager;
