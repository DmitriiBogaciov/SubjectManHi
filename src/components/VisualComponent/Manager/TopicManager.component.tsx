import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";


//Components


//Custom components
import TopicModalData from "../../data-component/Modals/TopicModal.datacomponent.tsx";
import ModifiableList from "../ModifiableList.component.tsx";


//~~~Props~~~
import { TopicDataProps } from "../../../props/nonVisual/Topic.dataprops.tsx";
import { ModalDataProps } from "../../../props/nonVisual/Modal.dataprops.tsx";
import Button from "../Button.component.tsx";


const TopicManager = ({ all_topics, permissions_, delete_topic_handler, edit_topic_handler }:
    {
        all_topics: Array<TopicDataProps>, permissions_: Array<string>,
        delete_topic_handler:  (topic: TopicDataProps) => boolean,
        edit_topic_handler:  (topic: TopicDataProps) => boolean
    }) => {

    const [allTopics, setAllTopics] = useState<Array<TopicDataProps>>(all_topics);
    const [editingTopic, setEditingTopic] = useState<TopicDataProps>();


    const [modListItems, setModListItems] = useState<Array<{ label: string, value: string | object | number }>>([])
    const [modal, setModal] = useState<ModalDataProps>({})

    const { t } = useTranslation();

    useEffect(() => {
        setAllTopics(all_topics);
        let newArray: Array<{ label: string, value: string | object | number }> = []
        for (let sp in allTopics) {
            newArray.push({ label: allTopics[sp].name, value: allTopics[sp] })
        }
        setModListItems(newArray);
        console.log(modListItems)
    }, [all_topics])

    const toggleModalHandler = (open:boolean) =>
    {
        let newModal = { ...modal };
        newModal.show = open;
        setModal(newModal);
    };

    return (

        <>
            <h1>{t("manager.topic.title")}</h1>
            <div className="flex justify-end">
                <Button type="Submit" label={t("manager.topic.createNew")} on_click_handler={()=>{
                    setEditingTopic({_id:"",description:"",name:"",digitalContentIdList:[]});
                    toggleModalHandler(true);
                    }}></Button>
            </div>
            <div>
                <ModifiableList list_items={modListItems} title={t("manager.topic.list")}
                    delete_from_list_handler={(value: string | object | number) => {
                        //Checking if incoming value is object with corresponding object
                        if (typeof value === "object" && "digitalContentIdList" in value)   
                        {
                            return delete_topic_handler(value);
                        }                                                
                        return false;

                    }}
                    edit_from_list_handler={(value: string | object | number) => {
                        //Checking if incoming value is object with corresponding object
                        if (typeof value === "object" && "digitalContentIdList" in value) {
                                let newTopic: TopicDataProps = JSON.parse(JSON.stringify(value));
                                toggleModalHandler(true);
                                setEditingTopic({ ...newTopic })
                        }
                        return false;
                    }} />

                <TopicModalData  modal_props={modal} editing_topic_id={editingTopic?._id}></TopicModalData>
            </div>

        </>

    )
}

export default TopicManager;
