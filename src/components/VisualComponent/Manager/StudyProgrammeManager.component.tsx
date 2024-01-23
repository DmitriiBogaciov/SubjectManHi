import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

//Custom components
import ModifiableList from "../ModifiableList.component.tsx";

//API URL of server
import GetApiUrl from "../../../assets/helperFunc/GetApiUrl.helper.tsx";

//~~~Props~~~
import { LoadingStatus } from "../../../props/nonVisual/LoadingStatus.data.tsx";
import { StudyProgrammeDataPorps } from "../../../props/nonVisual/StudyProgramme.dataprops.tsx";


const StudyProgrammeManager = ({all_study_programmes,permissions_}:{all_study_programmes:Array<StudyProgrammeDataPorps>,permissions_:Array<String>}) => {

    const [allStudyProgrammes, setAllStudyProgrammes] = useState<Array<StudyProgrammeDataPorps>>(all_study_programmes);
    const [modListItems,setModListItems] = useState<Array<{label:String,value:String|object|number}>>([])

    const { t } = useTranslation();
    
    useEffect(()=>
    {
        setAllStudyProgrammes(all_study_programmes);
        let newEntries:Array<{label:String,value:String|object|number}> = [];
        for(let sp in allStudyProgrammes)
        {
            newEntries.push({label:allStudyProgrammes[sp].name,value:allStudyProgrammes[sp]})
        }
        setModListItems(newEntries);
        console.log(all_study_programmes)

    },[all_study_programmes])


    return (

        <>
            <h1>{t("manager.studyProgramme.title")}</h1>
            <div>
                <ModifiableList listItems={modListItems} title={t("manager.studyProgramme.list")} onDeleteFromListHandler={()=>{}} onEditFromListHandler={()=>{}} />
            </div>
        </>

    )
}

export default StudyProgrammeManager;
