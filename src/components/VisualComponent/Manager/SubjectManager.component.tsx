import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";


//Components


//Custom components
import ModifiableList from "../ModifiableList.component.tsx";


//~~~Props~~~
import { LoadingStatus } from "../../../props/nonVisual/LoadingStatus.data.tsx";
import { StudyProgrammeDataProps, StudyProgrammeSubjectsDataPorps } from "../../../props/nonVisual/StudyProgramme.dataprops.tsx";
import StudyProgrammeModalData from "../../data-component/Modals/StudyProgrammeModal.datacomponent.tsx";
import { ModalDataProps } from "../../../props/nonVisual/Modal.dataprops.tsx";
import Button from "../Button.component.tsx";


const SubjectManager = ({ all_study_programmes, permissions_, delete_study_programme_handler, edit_study_programme_handler }:
    {
        all_study_programmes: Array<StudyProgrammeDataProps>, permissions_: Array<string>,
        delete_study_programme_handler: (study_programme: StudyProgrammeDataProps) => boolean,
        edit_study_programme_handler: (study_programme: StudyProgrammeDataProps) => boolean
    }) => {

    const [allStudyProgrammes, setAllStudyProgrammes] = useState<Array<StudyProgrammeDataProps>>(all_study_programmes);
    const [editingStudyProgramme, setEditingStudyProgramme] = useState<StudyProgrammeDataProps>();


    const [modListItems, setModListItems] = useState<Array<{ label: string, value: string | object | number }>>([])
    const [modal, setModal] = useState<ModalDataProps>({})

    const { t } = useTranslation();

    useEffect(() => {
        setAllStudyProgrammes(all_study_programmes);
        let newArray: Array<{ label: string, value: string | object | number }> = []
        for (let sp in allStudyProgrammes) {
            newArray.push({ label: allStudyProgrammes[sp].name, value: allStudyProgrammes[sp] })
        }
        setModListItems(newArray);
        console.log(modListItems)
    }, [all_study_programmes])

    const toggleModalHandler = (open:boolean) =>
    {
        let newModal = { ...modal };
        newModal.show = open;
        setModal(newModal);
    };

    return (

        <>
            <h1>{t("manager.studyProgramme.title")}</h1>
            <div className="flex justify-end">
                <Button type="Submit" label={t("manager.studyProgramme.createNew")} on_click_handler={()=>{
                    setEditingStudyProgramme({_id:"",description:"",language:"Czech",name:"",studyDegree:"Master",subjects:[]});
                    toggleModalHandler(true);
                    }}></Button>
            </div>
            <div>
                <ModifiableList list_items={modListItems} title={t("manager.studyProgramme.list")}
                    delete_from_list_handler={(value: string | object | number) => {
                        //Checking if incoming value is object with corresponding object
                        if (typeof value === "object" && "studyDegree" in value)                                                   
                            return delete_study_programme_handler(value);
                        return false;

                    }}
                    edit_from_list_handler={(value: string | object | number) => {
                        //Checking if incoming value is object with corresponding object
                        if (typeof value === "object" && "studyDegree" in value) {
                                let newObject = (JSON.stringify(value));
                                newObject = JSON.parse(newObject)
                                let newProgramme: StudyProgrammeDataProps = JSON.parse(JSON.stringify(value));
                                toggleModalHandler(true);
                                setEditingStudyProgramme({ ...newProgramme })
                        }
                        return false;
                    }} />

                <StudyProgrammeModalData modal_props={modal} editing_study_programme_id={editingStudyProgramme?._id}></StudyProgrammeModalData>
            </div>

        </>

    )
}

export default SubjectManager;
