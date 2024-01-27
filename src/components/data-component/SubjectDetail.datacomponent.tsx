import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from 'react-toastify';


//Custom components...
import Loading from "../VisualComponent/Loading.component.tsx";
import Error from "../VisualComponent/Error.component.tsx";
import SubjectDetail from "../VisualComponent/SubjectDetail.component.tsx";

//API URL of server
import GetApiUrl from "../../assets/helperFunc/GetApiUrl.helper.tsx";

//Props
import { SubjectDataProps} from "../../props/nonVisual/Subject.dataprops.tsx";
import { LoadingStatus } from "../../props/nonVisual/LoadingStatus.data.tsx";
import { CardProps } from "../../props/Card.props.tsx";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router";
import { TopicDataProps } from "../../props/nonVisual/Topic.dataprops.tsx";


const SubjectDetailData = ({ subject_id }: { subject_id?: string }) => {

    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("Pending");
    const [subject, setSubject] = useState<SubjectDataProps>();
    const [allSubjectTopics, setAllSubjectTopics] = useState<Array<TopicDataProps>>([]);

    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(subject_id)
        if (subject_id)
            getAllTopicsFromSubjects(subject_id);

    }, [subject_id]);

    const getAllTopicsFromSubjects = async (subjectId: string) => {
        try {
            setLoadingStatus("Pending")
            let response = await axios.get(`${GetApiUrl()}/subject/get/${subjectId}`)

            if (response && response.data && response.data.response_code === 200) {

                let subject: SubjectDataProps =  (Array.isArray(response.data.result)?response.data.result[0]:response.data.result);
                setSubject(subject)
                let allTopics = await getAllTopics();
                
                console.log(subject)
                console.log(allTopics)

                if(allTopics)
                {
                    //Getting only relevant topics
                    allTopics.map((topic)=>
                    {
                        for(let d in subject.topicIdList)
                        {
                            if(subject.topicIdList[d] === topic._id)
                                allSubjectTopics.push(topic)
                        }
                    });
                }

                console.log(allSubjectTopics)
                setLoadingStatus("Loaded")

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
    const getAllTopics = async () => {
        try {
            let response = await axios.get(`${GetApiUrl()}/topic/list`)

            if (response && response.data && response.data.response_code === 200) {
                let topics = response.data.result;
                return topics;
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


    return (

        <div className="">
            {
                (loadingStatus === "Pending") ?
                    <Loading></Loading>
                    : (loadingStatus === "Error") ?
                        <Error message={""}></Error>
                        : <SubjectDetail _subject={subject} all_subject_topics={allSubjectTopics}></SubjectDetail>
            }
        </div>

    )
}

export default SubjectDetailData;
