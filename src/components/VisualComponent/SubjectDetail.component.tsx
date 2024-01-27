import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from 'react-toastify';


//Custom components...
import TopicCardData from "../data-component/TopicCard.datacomponent.tsx";
//API URL of server
import GetApiUrl from "../../assets/helperFunc/GetApiUrl.helper.tsx";

//Props
import { SubjectDataProps } from "../../props/nonVisual/Subject.dataprops.tsx";
import { useNavigate } from "react-router";
import { TopicDataProps } from "../../props/nonVisual/Topic.dataprops.tsx";
import SearchField from "./SearchField.component.tsx";
import Button from "./Button.component.tsx";
import { Modal, ModalProps } from "react-bootstrap";
import ModifiableList from "./ModifiableList.component.tsx";
import StudentsModalData from "../data-component/Modals/StudentsModal.datacomponent.tsx";


const SubjectDetail = ({ _subject, all_subject_topics }: { _subject?: SubjectDataProps, all_subject_topics: Array<TopicDataProps> }) => {

    const [studentModal, setStudentModal] = useState<ModalProps>({});

    const [subject, setSubject] = useState<SubjectDataProps>({
        description: "",
        language: "Czech",
        name: "",
        credits: 0,
        digitalContentIdList: [],
        goal: "",
        students: [],
        supervisor: { _id: "", userName: "" },
        topicIdList: []
    });

    const [allSubjectTopics, setAllSubjectTopics] = useState<Array<TopicDataProps>>(all_subject_topics);
    const [searchedTopics, setSearchedTopics] = useState<Array<TopicDataProps>>(all_subject_topics);

    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        if (_subject)
            setSubject(_subject)
        setAllSubjectTopics(all_subject_topics)
    }, [all_subject_topics, _subject])


    //Search field confirmation
    const searchFieldHandler = (searchedString) => {
        if (searchedString && searchedString !== "") {
            setSearchedTopics(allSubjectTopics.filter((sp) => {
                if (sp.name.toLowerCase().includes(searchedString.toLowerCase()))
                    return sp;
            }));
        }
        else
            setSearchedTopics(allSubjectTopics)
    }


    return (
        <>
            <div className="font-light">
                <div className="grid grid-cols-2 bg-slate-900 text-white p-10">
                    <div>
                        <h1 className="text-left border-l-2 p-2">{subject.name}</h1>
                    </div>
                    <div className="flex justify-end align-middle">
                        <div className="flex p-2 text-left">
                            <p className="align-middle text-center font-bold mr-2">{t("subject.credits")}:</p>
                            <p className="align-middle text-center">{subject.credits}</p>
                        </div>
                        <div className="flex p-2 text-left border-l-2">
                            <p className="align-middle text-center font-bold mr-2">{t("subject.language")}:</p>
                            <p className="align-middle text-center">{subject.language}</p>
                        </div>
                    </div>
                </div>
                <div className="flex justify-start p-2 shadow-md">
                    <div className="align-middle flex mr-4">
                        <p className="m-auto ml-4 font-bold mr-2">{t("subject.numberOfStudents")}:</p>
                        <p className="m-auto">{subject.students?.length}</p>
                    </div>
                    <div>
                        <Button label={t("subject.student.overview")} on_click_handler={() => {setStudentModal({...studentModal,show:true})}} type="Submit" />
                    </div>
                </div>
                <div className="bg-slate-100 pt-10">
                    <div className="mb-5 p-5">
                        <p className="text-left">{subject.description}</p>
                    </div>

                    <div className="mb-5 p-5">
                        <p className="text-left font-bold mr-2">{t("subject.topic.title")}:</p>
                        <div className="pl-6">
                            <SearchField place_holder={t("subject.topic.search")} confirmSearchHandler={searchFieldHandler}></SearchField>
                        </div>
                        {
                            (searchedTopics.length) ?
                                searchedTopics.map((topic) => {
                                    return (
                                        <div className={"mb-4"}>
                                            <TopicCardData _topic={topic} card_props={{ cursorEffect: "onHover" }}></TopicCardData>
                                        </div>
                                    )
                                }) :
                                <p className="p-2">{t("list.empty")}</p>
                        }
                    </div>
                </div>
            </div>
           <StudentsModalData _subject={subject} modal_props={{...studentModal}}></StudentsModalData>
        </>
    )
}

export default SubjectDetail;
