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
import IsAuthorized from "../IsAuthorized.tsx";
import { GetRoleByPermissions, GetRolePermissions } from "../../assets/helperFunc/GetRolePermissions.helper.tsx";
import { UserDataProps } from "../../props/nonVisual/User.dataprops.tsx";
import { jwtDecode } from "jwt-decode";


const SubjectDetail = ({ _subject, all_subject_topics, _user }: { _subject?: SubjectDataProps, all_subject_topics: Array<TopicDataProps>, _user: UserDataProps }) => {

    const [studentModal, setStudentModal] = useState<ModalProps>({});
    const [user, setUser] = useState<UserDataProps>(_user);

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



    useEffect(() => {
        setUser({ ..._user });
        console.log(_user)

    }, [_user])

    if (user._token)
        console.log(jwtDecode(user._token).sub)
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
                <div className="grid sm:grid-cols-2 grid-cols-1 bg-slate-900 text-white sm:p-10 pb-10 ">
                    <div className="sm:m-0 mb-10">
                        <h1 className="sm:text-3xl text-2xl text-left border-l-2 p-2">{subject.name}</h1>
                    </div>
                    <div className="sm:flex block justify-end align-middle">
                        <div className="flex p-2 text-left">
                            <p className="align-middle text-center font-bold mr-2">{t("subject.credits")}:</p>
                            <p className="align-middle text-center">{subject.credits}</p>
                        </div>
                        <div className="flex p-2 text-left sm:border-l-2">
                            <p className="align-middle text-center font-bold mr-2">{t("subject.language")}:</p>
                            <p className="align-middle text-center">{subject.language}</p>
                        </div>
                    </div>
                    <div className="sm:flex justify-start mt-3 p-2">
                        <div className="align-middle flex mr-4">
                            <p className=" font-bold mr-2">{t("subject.numberOfStudents")}:</p>
                            <p className="">{subject.students?.length}</p>
                        </div>
                        <IsAuthorized neededPermissions={GetRolePermissions("Teacher")}>
                            <div>
                                <Button label={t("subject.student.overview")} on_click_handler={() => { setStudentModal({ ...studentModal, show: true }) }} type="Submit" />
                            </div>
                        </IsAuthorized>
                    </div>
                </div>
                <div className="bg-slate-100 pt-10">
                    <div className="mb-5 p-4 ml-2 border-l-2 border-black">
                        <p className="text-left">{subject.description}</p>
                    </div>
                    {
                        //Checking if user is student and is part of this subject
                        ((user._permissions && GetRoleByPermissions(user._permissions) === "Student"
                            && (user._token && subject.students && subject.students.filter((st) => {
                                let dToken = jwtDecode(user._token)
                                console.log(dToken.sub, st)
                                if (dToken.sub == st._id) {
                                    console.log(st)
                                    return st;
                                }

                            }).length > 0)))
                            || (user._permissions && (GetRoleByPermissions(user._permissions) === "Teacher" || GetRoleByPermissions(user._permissions) === "Admin")) ?
                            <div className="mb-5 sm:p-5">
                                <p className="text-left mr-2 uppercase text-xl mb-3">{t("subject.topic.title")}:</p>
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
                            </div> :
                            <>
                            </>
                    }
                </div>
            </div>
            <StudentsModalData _subject={subject} modal_props={{ ...studentModal }}></StudentsModalData>
        </>
    )
}

export default SubjectDetail;
