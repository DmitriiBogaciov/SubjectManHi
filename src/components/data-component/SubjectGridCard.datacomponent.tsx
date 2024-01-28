import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from 'react-toastify';


//Custom components...
import Loading from "../VisualComponent/Loading.component.tsx";
import Error from "../VisualComponent/Error.component.tsx";
import GridCard from "../VisualComponent/GridCard.component.tsx";
import SearchField from "../VisualComponent/SearchField.component.tsx";
import SubjectGridCard from "../VisualComponent/SubjectGridCard.component.tsx";

//API URL of server
import GetApiUrl from "../../assets/helperFunc/GetApiUrl.helper.tsx";

//Props
import { SubjectDataProps } from "../../props/nonVisual/Subject.dataprops.tsx";
import { LoadingStatus } from "../../props/nonVisual/LoadingStatus.data.tsx";
import { CardProps } from "../../props/Card.props.tsx";
import { StudyProgrammeDataProps, StudyProgrammeSubjectsDataProps } from "../../props/nonVisual/StudyProgramme.dataprops.tsx";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router";


const SubjectGridCardData = ({ study_programme_id }: { study_programme_id?: string }) => {

    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("Pending");
    const [cardItems, setCardItems] = useState<Array<CardProps>>([]);
    const [allStudyProgrammeSubjects, setAllStudyProgrammeSubjects] = useState<Array<{ studyProgrammeSubject: StudyProgrammeSubjectsDataProps, subject: SubjectDataProps }>>([]);

    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(study_programme_id)
        if (study_programme_id)
            getAllSubjectsFromStudyProgramme(study_programme_id);

    }, [study_programme_id]);

    const getAllSubjectsFromStudyProgramme = async (studyProgrameId: string) => {
        try {
            setLoadingStatus("Pending")
            let response = await axios.get(`${GetApiUrl()}/study-programme/get/${studyProgrameId}`)

            if (response && response.data && response.data.response_code === 200) {

                let studyProgramme: StudyProgrammeDataProps = response.data.result;
                let allSubj: Array<SubjectDataProps> = await getAllSubjects();

                if (allSubj) {
                    //Getting subjects that are inside studyProgramme
                    allSubj.filter((sub) => {
                        for (let s in studyProgramme.subjects) {
                            if (studyProgramme.subjects[s]._id == sub._id) {
                                console.log("match")
                                allStudyProgrammeSubjects.push({ studyProgrammeSubject: studyProgramme.subjects[s], subject: sub })
                                return sub;
                            }
                        }
                    })

                    //Setting cards for view 
                    setNewCardItemsFromSubjects((allStudyProgrammeSubjects) ? allStudyProgrammeSubjects : [])
                    setLoadingStatus("Loaded")
                }
            } else {

                setLoadingStatus("Error");
                toast.error("Something went wrong when obtaining subjects", {
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
    const getAllSubjects = async () => {
        try {
            let response = await axios.get(`${GetApiUrl()}/subject/list`)

            if (response && response.data && response.data.response_code === 200) {

                let subjects = response.data.result;
                return subjects;
            } else {

                setLoadingStatus("Error");
                toast.error("Something went wrong when obtaining subjects", {
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
        return null;
    }

    const setNewCardItemsFromSubjects = (allStudyProgrammeSubjects: Array<{ studyProgrammeSubject: StudyProgrammeSubjectsDataProps, subject: SubjectDataProps }> | undefined) => {
        let newEntries: Array<CardProps> = []
        for (let s in allStudyProgrammeSubjects)
            newEntries.push({
                title: allStudyProgrammeSubjects[s].subject.name, text: allStudyProgrammeSubjects[s].subject.description, cursorEffect: "onHover",
                value: { studyProgrammeSubject: allStudyProgrammeSubjects[s].studyProgrammeSubject, subject: allStudyProgrammeSubjects[s].subject },
                //Redirect after clicking
                onClick: () => {navigate(`/subject/${allStudyProgrammeSubjects[s].subject._id}`, { state: { id: allStudyProgrammeSubjects[s].subject._id } }) },
            })
        console.log(newEntries)
        setCardItems(newEntries)
    }



    return (

        <div className="">
            {
                (loadingStatus === "Pending") ?
                    <Loading></Loading>
                    : (loadingStatus === "Error") ?
                        <Error message={""}></Error>
                        :
                        <>
                        
                            <SubjectGridCard all_study_programme_subjects={allStudyProgrammeSubjects}></SubjectGridCard>
                        </>
            }

        </div>

    )
}

export default SubjectGridCardData;
