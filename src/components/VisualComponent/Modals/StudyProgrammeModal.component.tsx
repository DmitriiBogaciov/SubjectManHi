import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

//Components
import { Modal, Form, Tab, Tabs, Row, Col, Nav } from "react-bootstrap";
import Select from 'react-select'

//Custom components
import Button from '../Button.component.tsx';

//Props
import { ModalDataProps } from '../../../props/nonVisual/Modal.dataprops.tsx';
import { StudyProgrammeDataProps, StudyProgrammeSubjectsDataProps } from '../../../props/nonVisual/StudyProgramme.dataprops.tsx';
import { SubjectDataProps } from '../../../props/nonVisual/Subject.dataprops.tsx';

const StudyProgrammeModal = ({ modal_props, editing_study_programme, _subjects }: { modal_props: ModalDataProps, editing_study_programme?: StudyProgrammeDataProps, _subjects: Array<SubjectDataProps> }) => {
    const [modal, setModal] = useState<ModalDataProps>(modal_props)
    const [editingStudyProgramme, setEditingStudyProgramme] = useState<StudyProgrammeDataProps>
        ((editing_study_programme) ? editing_study_programme :
            {
                description: "",
                language: "Czech",
                name: "",
                studyDegree: "Bachelor",
                subjects: new Array<StudyProgrammeSubjectsDataProps>()
            });

    const [subjects, setSubjects] = useState<{
        subjectsYear1: Array<{ value: object, label: string, subjectInStudyPrograme: StudyProgrammeSubjectsDataProps }>,
        subjectsYear2: Array<{ value: object, label: string, subjectInStudyPrograme: StudyProgrammeSubjectsDataProps }>,
        subjectsYear3: Array<{ value: object, label: string, subjectInStudyPrograme: StudyProgrammeSubjectsDataProps }>,
        subjectsYear4: Array<{ value: object, label: string, subjectInStudyPrograme: StudyProgrammeSubjectsDataProps }>
    }>(
        {

            subjectsYear1: [],
            subjectsYear2: [],
            subjectsYear3: [],
            subjectsYear4: []
        }
    )

    const [allSubjectOptions, setAllSubjectOptions] = useState<Array<{ value: object, label: string }>>([]);

    const { t } = useTranslation();

    //Setting subjects into selection fields 
    const setSubjectOptionsFromStudyProgramme = (studyProgramme: StudyProgrammeDataProps, allSubjects:Array<SubjectDataProps>) => {

        if (studyProgramme) {
            console.log(studyProgramme)

            //First clear subjects in inputs
            for (let s in studyProgramme.subjects) {
                subjects["subjectsYear" + studyProgramme.subjects[s].year] = [];
            }
            for (let s in studyProgramme.subjects) {
                for (let i in allSubjects) {
                    if (allSubjects[i]._id && allSubjects[i]._id === studyProgramme.subjects[s]._id) {
                        console.log(studyProgramme.subjects[s])
                        let subjectEntry = { value: allSubjects[i], label: allSubjects[i].name, 
                            subjectInStudyPrograme: studyProgramme.subjects[s] }
                      
                        subjects["subjectsYear" + studyProgramme.subjects[s].year].push(subjectEntry);
                    }
                }
            }
        }

    }

    const setSubjectsOfEditingStudyProgramme = (subjects: {
        subjectsYear1: Array<{ value: object, label: string, subjectInStudyPrograme: StudyProgrammeSubjectsDataProps }>,
        subjectsYear2: Array<{ value: object, label: string, subjectInStudyPrograme: StudyProgrammeSubjectsDataProps }>,
        subjectsYear3: Array<{ value: object, label: string, subjectInStudyPrograme: StudyProgrammeSubjectsDataProps }>,
        subjectsYear4: Array<{ value: object, label: string, subjectInStudyPrograme: StudyProgrammeSubjectsDataProps }>
    }) => {

        editingStudyProgramme.subjects = new Array<StudyProgrammeSubjectsDataProps>();
        Object.keys(subjects).map((subjectKey) => {
            for (let i in subjects[subjectKey]) {

                if (subjects[subjectKey][i].subjectInStudyPrograme && subjects[subjectKey][i].subjectInStudyPrograme._id) {
                    editingStudyProgramme.subjects.push(
                        {
                            _id: subjects[subjectKey][i].subjectInStudyPrograme._id,
                            semester: subjects[subjectKey][i].subjectInStudyPrograme.semester,
                            type: subjects[subjectKey][i].subjectInStudyPrograme.type,
                            year: subjects[subjectKey][i].subjectInStudyPrograme.year
                        })
                }
            }
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingStudyProgramme((prevData) => ({ ...prevData, [name]: value }));
    };

    //spSubject is more like metadata of what semester and what type is subject
    const handleSubjectsChange = (value, spSubject: StudyProgrammeSubjectsDataProps) => {

        let f = JSON.parse(JSON.stringify(subjects));
        console.log(f);
        console.log(value)
        //Keep other subjects but not those we are adding
        f["subjectsYear" + spSubject.year] = subjects["subjectsYear" + spSubject.year].filter((s) => {
            if (s.subjectInStudyPrograme) {
                if (s.subjectInStudyPrograme.semester != spSubject.semester || s.subjectInStudyPrograme.type != spSubject.type)
                    return s

            }
        });
        for (let v in value) {
            spSubject._id = value[v].value._id
            f["subjectsYear" + spSubject.year].push({ value: value[v].value, label: value[v].label, subjectInStudyPrograme: spSubject })
        }

        setSubjects(f);
    }

    useEffect(() => {
        if (editing_study_programme) {
            console.log(editing_study_programme)
            setEditingStudyProgramme(editing_study_programme);
            setSubjectOptionsFromStudyProgramme(editing_study_programme,_subjects);
            setSubjectsOfEditingStudyProgramme(subjects);
        }

        //Setting subject options...
        let newOptions: Array<{ value: object, label: string }> = [];
        for (let s in _subjects) {
            newOptions.push({ value: _subjects[s], label: _subjects[s].name })
        }
        setAllSubjectOptions(newOptions)

        setModal(modal_props);
    }, [editing_study_programme, _subjects, modal_props])



    return (
        <>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>{t("form.name")}</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter programme name"
                            name="name"
                            value={editingStudyProgramme.name}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>{t("form.description")}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter programme description"
                            name="description"
                            value={editingStudyProgramme.description}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formLanguage">
                        <Form.Label>{t("form.language")}</Form.Label>
                        <Form.Control
                            as="select"
                            name="language"
                            value={editingStudyProgramme.language}
                            onChange={handleInputChange}
                        >
                            <option value="">{t("form.chooseLanguage")}</option>
                            <option value="Czech">Czech</option>
                            <option value="English">English</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formDegree">
                        <Form.Label>{t("form.studyDegree")}</Form.Label>
                        <Form.Control
                            as="select"
                            name="studyDegree"
                            value={editingStudyProgramme.studyDegree}
                            onChange={handleInputChange}
                        >
                            <option value="">{t("form.chooseDegree")}</option>
                            <option value="Bachelor">{t("subject.studyDegree.bachelor")}</option>
                            <option value="Master">{t("subject.studyDegree.master")}</option>
                        </Form.Control>
                    </Form.Group>

                    <Tabs className="mt-3 mb-4 custom-bt-tab">
                        {
                            //Looping for every year for subject selection
                            Object.keys(subjects).map((subjectKey) => {
                                {/* Year selection... */ console.log(subjectKey) }
                                return (
                                    <Tab eventKey={subjectKey} title={t(`subject.${subjectKey}`)}>
                                        {/* Semester selection... */}
                                        <Tabs defaultActiveKey="winter" className='mb-2 custom-bt-tab'>
                                            {
                                                //Semesters
                                                ["winter", "summer"].map((semester) => {
                                                    return (
                                                        <Tab className='' title={t(`subject.semester.${semester}`)} eventKey={semester}>
                                                            {/* Type selection (mandatory, optinal...)... */}
                                                            <Tabs id="left-tabs-example" defaultActiveKey="mandatory" className=''>
                                                                {
                                                                    //Type of subject
                                                                    ["mandatory", "optional", "mandatory_optional"].map((subjectType) => {
                                                                        return (
                                                                            <Tab title={t(`subject.type.${subjectType}`)} eventKey={subjectType}>
                                                                                <Form.Group controlId="formSubjects">
                                                                                    <Form.Label>{t(`subject.year${parseInt(subjectKey.replace("subjectsYear", ""))}`)}</Form.Label>
                                                                                    <Select isMulti={true}
                                                                                    hideSelectedOptions={true}
                                                                                        onChange={(e) =>
                                                                                            handleSubjectsChange(e,
                                                                                                {
                                                                                                    _id: "", semester: (semester === "winter" || semester === "summer") ? semester : "winter",
                                                                                                    type: (subjectType === "mandatory" || subjectType === "optional" || subjectType === "mandatory_optional") ? subjectType : "optional",
                                                                                                    year: parseInt(subjectKey.replace("subjectsYear", ""))
                                                                                                })}

                                                                                        isSearchable={true}
                                                                                        options={allSubjectOptions}
                                                                                        value={subjects[subjectKey].filter((s) => {
                                                                                            if (s.subjectInStudyPrograme) {
                                                                                                console.log(s.subjectInStudyPrograme)
                                                                                                if (s.subjectInStudyPrograme && s.subjectInStudyPrograme.semester === semester &&
                                                                                                    s.subjectInStudyPrograme.year === parseInt(subjectKey.replace("subjectsYear", "")) && s.subjectInStudyPrograme.type === subjectType)
                                                                                                    return { value: s.value, label: s.label }
                                                                                            }
                                                                                            else
                                                                                                return { value: s.value, label: s.label }
                                                                                        })} />

                                                                                </Form.Group>
                                                                            </Tab>
                                                                        )
                                                                    })
                                                                }
                                                            </Tabs>
                                                        </Tab>
                                                    )
                                                })
                                            }

                                        </Tabs>
                                    </Tab>
                                )
                            })

                        }
                    </Tabs>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button type="Submit" label={t("modal.save")} on_click_handler={() => { if (modal.confirm_handler){setSubjectsOfEditingStudyProgramme(subjects);  modal.confirm_handler(editingStudyProgramme)} }} />
                <Button type="Delete" label={t("modal.close")} on_click_handler={() => { if (modal.cancel_handler) modal.cancel_handler() }} />
            </Modal.Footer>
        </>
    );
};

export default StudyProgrammeModal;
