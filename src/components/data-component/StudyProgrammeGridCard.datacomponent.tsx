import React, { useEffect, useState } from "react";


//Custom components...
import Loading from "../VisualComponent/Loading.component.tsx";
import Error from "../VisualComponent/Error.component.tsx";
import GridCard from "../VisualComponent/GridCard.component.tsx";

import axios from "axios";
import { toast } from 'react-toastify';

//API URL of server
import GetApiUrl from "../../assets/helperFunc/GetApiUrl.helper.tsx";

//Props
import { GridCardDataProps } from "../../props/nonVisual/GridCard.dataprops.tsx";
import { LoadingStatus } from "../../props/nonVisual/LoadingStatus.data.tsx";
import { CardProps } from "../../props/Card.props.tsx";
import { useTranslation } from "react-i18next";

const StudyProgrammeGridCardData = () => {

    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("Pending");
    const [cardItems, setCardItems] = useState<Array<CardProps>>([]);
    const [allStudyProgrammes, setAllStudyProgrammes] = useState();

    const { t } = useTranslation();

    useEffect(() => {
        const getAllStudyProgrammes = async () => {
            try {
                setLoadingStatus("Pending")
                let response = await axios.get(`${GetApiUrl()}/study-programme/list`)

                if (response && response.data && response.data.response_code === 200) {

                    let studyProgrammes = response.data.result;
                    setAllStudyProgrammes(studyProgrammes);
                    let newEntries: Array<CardProps> = []
                    for (let s in studyProgrammes)
                        newEntries.push({
                            title: studyProgrammes[s].name, text: studyProgrammes[s].description, cursorEffect: "onHover",
                            value: studyProgrammes[s]
                        })

                    setCardItems(newEntries)
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


    return (

        <div className="">
            {
                (loadingStatus === "Pending") ?
                    <Loading></Loading>
                    : (loadingStatus === "Error") ?
                        <Error message={""}></Error>
                        :
                        <>
                            <h2 className="text-left p-2 border-b-2 border-slate-400">{t("degree.bachelor")}</h2>
                            <GridCard card_items={
                                cardItems.filter((item) => {
                                    if (item.value && item.value.degree && item.value.degree === "Bachelor") {
                                        console.log(item.value)
                                        return item;
                                    }
                                })
                            }></GridCard>
                            <h2 className="text-left p-2 border-b-2 border-slate-400">{t("degree.master")}</h2>
                            <GridCard card_items={
                                cardItems.filter((item) => {
                                    if (item.value && item.value.degree && item.value.degree === "Master") {
                                        console.log(item.value)
                                        return item;
                                    }
                                })
                            }></GridCard>
                        </>
            }

        </div>

    )
}

export default StudyProgrammeGridCardData;
