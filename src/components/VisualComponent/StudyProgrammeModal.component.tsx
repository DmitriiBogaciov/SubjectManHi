import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

//Components
import { Modal, Form } from "react-bootstrap";
import Select from 'react-select'

//Custom components
import Button from './Button.component.tsx';

//Props
import { ModalDataProps } from '../../props/nonVisual/Modal.dataprops.tsx';
import { StudyProgrammeDataProps, StudyProgrammeSubjectsDataPorps } from '../../props/nonVisual/StudyProgramme.dataprops.tsx';
import { SubjectDataProps } from '../../props/nonVisual/Subject.dataprops.tsx';

const StudyProgrammeModal = ({ modal_props, editing_study_programme, _subjects }: { modal_props: ModalDataProps, editing_study_programme?: StudyProgrammeDataProps, _subjects: Array<SubjectDataProps> }) => {
    const [modal, setModal] = useState<ModalDataProps>(modal_props)
    const [editingStudyProgramme, setEditingStudyProgramme] = useState<StudyProgrammeDataProps>
        ((editing_study_programme) ? editing_study_programme :
            {
                description: "",
                language: "Czech",
                name: "",
                studyDegree: "Bachelor",
                subjects: []
            });

    const [subjects, setSubjects] = useState<{
        subjectsYear1: Array<{ value: object, label: string }>,
        subjectsYear2: Array<{ value: object, label: string }>,
        subjectsYear3: Array<{ value: object, label: string }>,
        subjectsYear4: Array<{ value: object, label: string }>
    }>(
        {
            subjectsYear1:[],
            subjectsYear2:[],
            subjectsYear3:[],
            subjectsYear4:[],
        }
    )

    const [subjectOptions, setSubjectOptions] = useState<Array<{ value: object, label: string }>>([]);

    const { t } = useTranslation();

    //Setting subjects into selection fields 
    const setSubjectOptionsFromStudyProgramme = (studyProgramme: StudyProgrammeDataProps) => {
        console.log("YOOOOOOOOOOOO")
        if (studyProgramme) {

            for (let s in studyProgramme.subjects) {
                for (let i in subjects) {
                    if (subjects[i]._id && subjects[i]._id === editingStudyProgramme.subjects[s]._id) {
                        let subjectEntry = { value: subjects[i]._id, label: subjects[i].name }
                        subjects["subjectsYear" + editingStudyProgramme.subjects[s].year].push(subjectEntry);
                    }
                }
            }
        }
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingStudyProgramme((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubjectsChange = (e, year) => {

        let f = JSON.parse(JSON.stringify(subjects));
        console.log(f)
        f["subjectsYear" + year] = new Array(...e);
        setSubjects(f);
    }

    useEffect(() => {
        if (editing_study_programme) {
            setEditingStudyProgramme(editing_study_programme);
            setSubjectOptionsFromStudyProgramme(editing_study_programme);
        }

        //Setting subject options...
        let newOptions: Array<{ value: object, label: string }> = [];
        for (let s in _subjects) {
            newOptions.push({ value: _subjects[s], label: _subjects[s].name })
        }
        setSubjectOptions(newOptions)

        setModal(modal_props);
    }, [editing_study_programme, _subjects, modal_props])




    return (
        <>
            <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter programme name"
                            name="name"
                            value={editingStudyProgramme.name}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>Description</Form.Label>
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
                        <Form.Label>Language</Form.Label>
                        <Form.Control
                            as="select"
                            name="language"
                            value={editingStudyProgramme.language}
                            onChange={handleInputChange}
                        >
                            <option value="">Choose language</option>
                            <option value="Czech">Czech</option>
                            <option value="English">English</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formDegree">
                        <Form.Label>Degree</Form.Label>
                        <Form.Control
                            as="select"
                            name="degree"
                            value={editingStudyProgramme.studyDegree}
                            onChange={handleInputChange}
                        >
                            <option value="">Choose degree</option>
                            <option value="Bachelor">Bachelor</option>
                            <option value="Master">Master</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formSubjects">
                        <Form.Label>Subjects for 1st year</Form.Label>
                        <Select isMulti={true} onChange={(e) => handleSubjectsChange(e, 1)} isSearchable={true} options={subjectOptions} value={subjects?.subjectsYear1}></Select>
                    </Form.Group>
                    <Form.Group controlId="formSubjects">
                        <Form.Label>Subjects for 2nd year</Form.Label>
                        <Select isMulti={true} onChange={(e) => handleSubjectsChange(e, 2)} isSearchable={true} options={subjectOptions} value={subjects?.subjectsYear2}></Select>
                    </Form.Group>
                    <Form.Group controlId="formSubjects">
                        <Form.Label>Subjects for 3rd year</Form.Label>
                        <Select isMulti={true} onChange={(e) => handleSubjectsChange(e, 3)} isSearchable={true} options={subjectOptions} value={subjects?.subjectsYear3}></Select>
                    </Form.Group>
                    <Form.Group controlId="formSubjects">
                        <Form.Label>Subjects for 4th year</Form.Label>
                        <Select isMulti={true} onChange={(e) => handleSubjectsChange(e, 4)} isSearchable={true} options={subjectOptions} value={subjects?.subjectsYear4}></Select>
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button type="Submit" label={t("modal.save")} on_click_handler={() => { }} />
                <Button type="Delete" label={t("modal.close")} on_click_handler={() => { if (modal.cancel_handler) modal.cancel_handler() }} />
            </Modal.Footer>
        </>
    );
};

export default StudyProgrammeModal;
