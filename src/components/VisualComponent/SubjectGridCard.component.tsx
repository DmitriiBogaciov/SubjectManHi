import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from 'react-toastify';


//Custom components...
import GridCard from "./GridCard.component.tsx";
import SearchField from "./SearchField.component.tsx";


//Props
import { SubjectDataProps } from "../../props/nonVisual/Subject.dataprops.tsx";
import { CardProps } from "../../props/Card.props.tsx";
import { StudyProgrammeSubjectsDataProps } from "../../props/nonVisual/StudyProgramme.dataprops.tsx";
import { Tab, Tabs } from "react-bootstrap";
import { useNavigate } from "react-router";


const SubjectGridCard = ({ all_study_programme_subjects }: { all_study_programme_subjects: Array<{ studyProgrammeSubject: StudyProgrammeSubjectsDataProps, subject: SubjectDataProps }> }) => {

    const [cardItems, setCardItems] = useState<Array<CardProps>>([]);
    const [allStudyProgrammeSubjects, setAllStudyProgrammeSubjects] = useState<Array<{ studyProgrammeSubject: StudyProgrammeSubjectsDataProps, subject: SubjectDataProps }>>(all_study_programme_subjects);
    const [availableYears, setAvailableYears] = useState<Array<number>>([]);

    const { t } = useTranslation();
    const navigate = useNavigate();


    useEffect(() => {
 
        setAllStudyProgrammeSubjects(all_study_programme_subjects);
        setAvailableYearsFromStudyProgrammeSubjects(all_study_programme_subjects);
        setNewCardItemsFromStudyProgrammeSubjects(all_study_programme_subjects);
    }, [all_study_programme_subjects])

    const setAvailableYearsFromStudyProgrammeSubjects = (allStudyProgrammeSubjects: Array<{ studyProgrammeSubject: StudyProgrammeSubjectsDataProps, subject: SubjectDataProps }> | undefined) => {
        //Getting subjects that are inside studyProgramme
        setAvailableYears([]);
        if(allStudyProgrammeSubjects)
            allStudyProgrammeSubjects.filter((sub) => {
                availableYears.push(sub.studyProgrammeSubject.year);
            })
        //Removing duplicates
        setAvailableYears([...new Set(availableYears)].sort())
    };

    const setNewCardItemsFromStudyProgrammeSubjects = (allStudyProgrammeSubjects: Array<{ studyProgrammeSubject: StudyProgrammeSubjectsDataProps, subject: SubjectDataProps }> | undefined) => {
        let newEntries: Array<CardProps> = []
        for (let s in allStudyProgrammeSubjects)
            newEntries.push({
                title: allStudyProgrammeSubjects[s].subject.name, text: allStudyProgrammeSubjects[s].subject.description, cursorEffect: "onHover",
                value: { studyProgrammeSubject: allStudyProgrammeSubjects[s].studyProgrammeSubject, subject: allStudyProgrammeSubjects[s].subject },
                //Redirect after clicking
                onClick: () => { navigate(`/subject/${allStudyProgrammeSubjects[s].subject._id}`, { state: { id: allStudyProgrammeSubjects[s].subject._id } }) },
            })

        console.log(newEntries)
        setCardItems(newEntries)
    }

    //Search field confirmation
    const searchFieldHandler = (searchedString) => {
        if (searchedString && searchedString !== "") {
            setNewCardItemsFromStudyProgrammeSubjects(allStudyProgrammeSubjects?.filter((sp) => {
                if (sp.subject.name.toLowerCase().includes(searchedString.toLowerCase()))
                    return sp;
            }));
        }
        else {
            setNewCardItemsFromStudyProgrammeSubjects(allStudyProgrammeSubjects)
        }
    }


    return (

        <div className="">
            <h1 className={"text-left uppercase text-2xl mt-1 mb-3"} >{t("subject.grid.title")}:</h1>
            <div>
                <SearchField confirmSearchHandler={searchFieldHandler}></SearchField>
            </div>
            {
                (allStudyProgrammeSubjects?.length > 0) ?
                    <>
                        {
                            availableYears.map((subjectYear) => {
                                return (
                                    <>
                                        <h2 className="text-left p-2 border-b-2 border-slate-400">{t(`subject.year${subjectYear.toString()}`)}</h2>
                                        <Tabs className="custom-bt-tab flex">
                                            {

                                                ["mandatory", "optional", "mandatory_optional"].map((subjectType) => {
                                                    return (
                                                        <Tab eventKey={subjectType} title={t(`subject.type.${subjectType}`)} tabClassName="sm:p-4 p-2" className="sm:p-5 p-2">
                                                            <h2 className="text-left text-xl font-bold mb-5 p-2 ">{t(`subject.type.${subjectType}`)}</h2>
                                                            {
                                                                ["winter", "summer"].map((semester) => {
                                                                    console.log(subjectYear)
                                                                    return (
                                                                        <>
                                                                            <h2 className="text-left p-2 border-b-2 border-slate-400">{t(`subject.semester.${semester}`)}</h2>
                                                                            <GridCard shown_when_empty={true} card_items={
                                                                                cardItems.filter((item) => {
                                                                                    console.log(item)
                                                                                    if (item.value  && item.value.studyProgrammeSubject && item.value.subject &&
                                                                                        item.value.studyProgrammeSubject.semester == semester &&
                                                                                        item.value.studyProgrammeSubject.type == subjectType &&
                                                                                        item.value.studyProgrammeSubject.year == subjectYear
                                                                                    ) {
                                                                                        console.log(item.value)
                                                                                        return item;
                                                                                    }
                                                                                })
                                                                            }></GridCard>
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </Tab>

                                                    )
                                                })
                                            }
                                        </Tabs>

                                    </>
                                )
                            })}
                    </> : <p>{t("noSubjects")}</p>
            }



        </div>

    )
}

export default SubjectGridCard;
