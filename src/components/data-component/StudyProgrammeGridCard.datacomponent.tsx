import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";


//Custom components...
import Loading from "../VisualComponent/Loading.component.tsx";
import Error from "../VisualComponent/Error.component.tsx";
import GridCard from "../VisualComponent/GridCard.component.tsx";
import SearchField from "../VisualComponent/SearchField.component.tsx";

import axios from "axios";
import { toast } from 'react-toastify';

//API URL of server
import GetApiUrl from "../../assets/helperFunc/GetApiUrl.helper.tsx";

//Props
import { StudyProgrammeDataProps } from "../../props/nonVisual/StudyProgramme.dataprops.tsx";
import { LoadingStatus } from "../../props/nonVisual/LoadingStatus.data.tsx";
import { CardProps } from "../../props/Card.props.tsx";
import { useNavigate } from "react-router";


const StudyProgrammeGridCardData = () => {

    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("Pending");
    const [cardItems, setCardItems] = useState<Array<CardProps>>([]);
    const [allStudyProgrammes, setAllStudyProgrammes] = useState<Array<StudyProgrammeDataProps>>();

    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const getAllStudyProgrammes = async () => {
            try {
                setLoadingStatus("Pending")
                let response = await axios.get(`${GetApiUrl()}/study-programme/list`)

                if (response && response.data && response.data.response_code === 200) {

                    let studyProgrammes = response.data.result;
                    setAllStudyProgrammes(studyProgrammes);
                    setNewCardItemsFromStudyProgrammes((studyProgrammes) ? studyProgrammes : [])
                    setLoadingStatus("Loaded")
                } else {

                    setLoadingStatus("Error");
                    toast.error("Something went wrong when obtaining study programmes", {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        onClose: () => {
                        },
                    });
                }
            } catch (error) {
                setLoadingStatus("Error");
                toast.error("Something went wrong when obtaining study programme", {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    onClose: () => {
                    },
                });
            }
        }
        getAllStudyProgrammes();
    }, []);

    const setNewCardItemsFromStudyProgrammes = (allStudyProgrammes: Array<StudyProgrammeDataProps> | undefined) => {
        let newEntries: Array<CardProps> = []
        for (let s in allStudyProgrammes)
            newEntries.push({
                title: allStudyProgrammes[s].name,
                text: allStudyProgrammes[s].description,
                cursorEffect: "onHover", 
                //Redirect after clicking
                onClick:()=>{navigate(`/studyProgramme/${allStudyProgrammes[s]._id}`,{state:{id:allStudyProgrammes[s]._id}})},
                value: allStudyProgrammes[s]
            })

        setCardItems(newEntries)
    }

    //Search field confirmation
    const searchFieldHandler = (searchedString) => {
        if (searchedString && searchedString !== "") {
            setNewCardItemsFromStudyProgrammes(allStudyProgrammes?.filter((sp)=>
            {
                if(sp.name.toLowerCase().includes(searchedString.toLowerCase()))
                    return sp;
            }));
        }
        else
        {
            setNewCardItemsFromStudyProgrammes(allStudyProgrammes)
        }
    }


    return (

        <div className="">
            {
                (loadingStatus === "Pending") ?
                    <Loading></Loading>
                    : (loadingStatus === "Error") ?
                        <Error message={""}></Error>
                        ://Does not have special visual components, so visualizating here
                        <div className="mt-5">
                            <div>
                                <SearchField confirmSearchHandler={searchFieldHandler}></SearchField>
                            </div>
                            <h2 className="text-left p-2 border-b-2 border-slate-400 uppercase">{t("subject.studyDegree.bachelor")}</h2>
                            <GridCard shown_when_empty={true} card_items={
                                cardItems.filter((item) => {
                                    if (item.value && item.value.studyDegree && item.value.studyDegree === "Bachelor") {                                      
                                        return item;
                                    }
                                })
                            }></GridCard>
                            <h2 className="text-left p-2 border-b-2 border-slate-400 mt-5 uppercase">{t("subject.studyDegree.master")}</h2>
                            <GridCard shown_when_empty={true} card_items={
                                cardItems.filter((item) => {
                                    if (item.value && item.value.studyDegree && item.value.studyDegree === "Master") {
                                        return item;
                                    }
                                })
                            }></GridCard>
                        </div>
            }

        </div>

    )
}

export default StudyProgrammeGridCardData;
