import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";


//Components


//Custom components
import SubjectModalData from "../../data-component/Modals/SubjectModal.datacomponent.tsx";
import ModifiableList from "../ModifiableList.component.tsx";


//~~~Props~~~
import { SubjectDataProps } from "../../../props/nonVisual/Subject.dataprops.tsx";
import { ModalDataProps } from "../../../props/nonVisual/Modal.dataprops.tsx";
import Button from "../Button.component.tsx";


const SubjectManager = ({ all_subjects, permissions_, delete_subject_handler, edit_subject_handler }:
    {
        all_subjects: Array<SubjectDataProps>, permissions_: Array<string>,
        delete_subject_handler: (subject: SubjectDataProps) => boolean,
        edit_subject_handler: (subject: SubjectDataProps) => boolean
    }) => {

    const [allSubjects, setAllSubjects] = useState<Array<SubjectDataProps>>(all_subjects);
    const [editingSubject, setEditingSubject] = useState<SubjectDataProps>();


    const [modListItems, setModListItems] = useState<Array<{ label: string, value: string | object | number }>>([])
    const [modal, setModal] = useState<ModalDataProps>({})

    const { t } = useTranslation();

    useEffect(() => {
        setAllSubjects(all_subjects);
        let newArray: Array<{ label: string, value: string | object | number }> = []
        for (let sp in allSubjects) {
            newArray.push({ label: allSubjects[sp].name, value: allSubjects[sp] })
        }
        setModListItems(newArray);
        console.log(modListItems)
    }, [all_subjects])

    const toggleModalHandler = (open:boolean) =>
    {
        let newModal = { ...modal };
        newModal.show = open;
        setModal(newModal);
    };

    return (

        <>
            <h1>{t("manager.subject.title")}</h1>
            <div className="flex justify-end">
                <Button type="Submit" label={t("manager.subject.createNew")} on_click_handler={()=>{
                    setEditingSubject({_id:"",description:"",language:"Czech",name:"",credits:0,digitalContentIdList:[],goal:"",students:[],supervisor:{_id:"",userName:""},topicIdList:[]});
                    toggleModalHandler(true);
                    }}></Button>
            </div>
            <div>
                <ModifiableList list_items={modListItems} title={t("manager.subject.list")}
                    delete_from_list_handler={(value: string | object | number) => {
                        //Checking if incoming value is object with corresponding object
                        if (typeof value === "object" && "credits" in value)                                                   
                            return delete_subject_handler(value);
                        return false;

                    }}
                    edit_from_list_handler={(value: string | object | number) => {
                        //Checking if incoming value is object with corresponding object
                        if (typeof value === "object" && "credits" in value) {
                                let newSubject: SubjectDataProps = JSON.parse(JSON.stringify(value));
                                toggleModalHandler(true);
                                setEditingSubject({ ...newSubject })
                        }
                        return false;
                    }} />

                <SubjectModalData  modal_props={modal} editing_subject_id={editingSubject?._id}></SubjectModalData>
            </div>

        </>

    )
}

export default SubjectManager;
