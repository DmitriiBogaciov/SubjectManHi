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
import StudyProgrammeModalData from "../../data-component/StudyProgrammeModal.datacomponent.tsx";


const StudyProgrammeManager = ({ all_study_programmes, permissions_, delete_study_programme_handler, edit_study_programme_handler }:
    {
        all_study_programmes: Array<StudyProgrammeDataProps>, permissions_: Array<string>,
        delete_study_programme_handler: (study_programme: StudyProgrammeDataProps) => boolean,
        edit_study_programme_handler: (study_programme: StudyProgrammeDataProps) => boolean
    }) => {

    const [allStudyProgrammes, setAllStudyProgrammes] = useState<Array<StudyProgrammeDataProps>>(all_study_programmes);
    const [editingStudyProgramme, setEditingStudyProgramme] = useState<StudyProgrammeDataProps>();


    const [modListItems, setModListItems] = useState<Array<{ label: string, value: string | object | number }>>([])
    const [modalShow, setModalShow] = useState<boolean>(true);

    const { t } = useTranslation();

    useEffect(() => {
        setAllStudyProgrammes(all_study_programmes);
        let newEntries: Array<{ label: string, value: string | object | number }> = [];
        for (let sp in allStudyProgrammes) {
            newEntries.push({ label: allStudyProgrammes[sp].name, value: allStudyProgrammes[sp] })
        }
        setModListItems(newEntries);
        console.log(all_study_programmes)

    }, [all_study_programmes])


    

    return (

        <>
            <h1>{t("manager.studyProgramme.title")}</h1>
            <div>
                <ModifiableList listItems={modListItems} title={t("manager.studyProgramme.list")}
                    delete_from_list_handler={(value: string | object | number) => {
                        //Checking if incoming value is object with corresponding object
                        if (typeof value === "object" && "studyDegree" in value)
                            return delete_study_programme_handler(value);
                        return false;

                    }}
                    edit_from_list_handler={(value: string | object | number) => {
                        //Checking if incoming value is object with corresponding object
                        console.log(value)
                        if (typeof value === "object" && "studyDegree" in value) {
                            console.log("yo")
                            setEditingStudyProgramme(value);
                            setModalShow(true);
                        }
                        return false;
                    }} />

                    <StudyProgrammeModalData modal_props={{type:"Create", show:modalShow}}></StudyProgrammeModalData>
            </div>
            
        </>

    )
}

export default StudyProgrammeManager;
