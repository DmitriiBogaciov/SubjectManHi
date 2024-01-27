import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

//Components
import { Modal, Form, Tab, Tabs, Row, Col, Nav } from "react-bootstrap";
import Select from 'react-select'

//Custom components
import Button from '../Button.component.tsx';
import ModifiableList from '../ModifiableList.component.tsx';

//Props
import { ModalDataProps } from '../../../props/nonVisual/Modal.dataprops.tsx';
import { TopicDataProps } from '../../../props/nonVisual/Topic.dataprops.tsx';
import { DigitalContentDataProps } from '../../../props/nonVisual/DigitalContent.dataprops.tsx';
import { SubjectDataProps } from '../../../props/nonVisual/Subject.dataprops.tsx';

const StudentsModal = ({ modal_props, _subject, update_students_handler }: { modal_props: ModalDataProps, _subject: SubjectDataProps, update_students_handler: (students: Array<{ _id: string, userName: string }>) => boolean }) => {
    const [modal, setModal] = useState<ModalDataProps>(modal_props);
    const [subject, setSubject] = useState<SubjectDataProps>(_subject);
    const [newStudent, setNewStudent] = useState<{ _id: string, userName: string }>({ _id: "", userName: "" });

    const [studentList, setStudentList] = useState<Array<{
        label: string;
        value: string | number | object;
    }>>([]);

    const { t } = useTranslation();

    useEffect(() => {
        setModal(modal_props);
        setSubject(_subject);
        setStudentListFromSubject(_subject);
        console.log(_subject)

    }, [modal_props, _subject])

    const setStudentListFromSubject = (subject: SubjectDataProps) => {
        subject.students?.map((student) => {
            studentList.push({ label: student.userName, value: student })
        });
    }


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent((prevData) => ({ ...prevData, [name]: value }));
    };




    return (
        <>
            <Modal.Body>
                <div className="">
                    <div>
                        <p>{t("subject.student.id")}</p>
                        <input onChange={handleInputChange} name='_id' type="text" value={newStudent._id}></input>
                    </div>
                    <div>
                        <p>{t("subject.student.userName")}</p>
                        <input onChange={handleInputChange} name='userName' type="text" value={newStudent.userName}></input>
                    </div>
                    <Button label={t("subject.student.add")} on_click_handler={() => {

                        subject.students?.push(newStudent);
                        setStudentListFromSubject(subject);
                        if (subject.students)
                            update_students_handler(subject.students)

                    }} type="Submit" ></Button>
                </div>
                <ModifiableList title={t("subject.student.modal")} list_items={studentList} delete_from_list_handler={(val) => {
                    console.log(val);

                    setStudentList([])
                    subject.students = subject.students?.filter((s) => {
                        if (s._id != val._id)
                            return s;
                    })
                    setStudentListFromSubject(subject)
                    if (subject.students)
                        return update_students_handler(subject.students)
                    else
                        return true;
                }}
                    edit_from_list_handler={(val) => { return true }}></ModifiableList>
            </Modal.Body>
            <Modal.Footer>
                <Button label={t("button.close")} on_click_handler={()=>{(modal.cancel_handler)?modal.cancel_handler():null}} type='Delete'></Button>
            </Modal.Footer>
        </>
    )
};

export default StudentsModal;
