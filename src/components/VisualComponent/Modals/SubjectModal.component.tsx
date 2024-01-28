import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

//Components
import { Modal, Form, Tab, Tabs, Row, Col, Nav } from "react-bootstrap";
import Select from 'react-select'

//Custom components
import Button from '../Button.component.tsx';

//Props
import { ModalDataProps } from '../../../props/nonVisual/Modal.dataprops.tsx';
import { SubjectDataProps } from '../../../props/nonVisual/Subject.dataprops.tsx';
import { TopicDataProps } from '../../../props/nonVisual/Topic.dataprops.tsx';

const SubjectModal = ({ modal_props, editing_subject, _topics }: { modal_props: ModalDataProps, editing_subject?: SubjectDataProps, _topics: Array<TopicDataProps> }) => {
    const [modal, setModal] = useState<ModalDataProps>(modal_props)
    const [editingSubject, setEditingSubject] = useState<SubjectDataProps>
        ((editing_subject) ? editing_subject :
            {
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

    const [topics, setTopics] = useState<Array<{ value: object, label: string }>>([])

    const [allTopicOptions, setAllTopicOptions] = useState<Array<{ value: object, label: string }>>([]);

    const { t } = useTranslation();

    //Setting topics into selection fields 
    const setTopicSelectionsFromSubject = (subject: SubjectDataProps, allTopics: Array<TopicDataProps>) => {

        if (subject) {
            console.log(subject)

            //First clear inputs
            let newTopics: Array<{ value: object, label: string }> = [];
            for (let s in subject.topicIdList) {
                for (let i in allTopics) {
                    if (allTopics[i]._id && allTopics[i]._id === subject.topicIdList[s]) {
                        console.log(allTopics[i])
                        newTopics.push({
                            value: allTopics[i], label: allTopics[i].name
                        })
                    }
                }
            }
            setTopics(newTopics);
        }

    }

    const setTopicsOfEditingSubject = (topics: Array<{ value: object, label: string }>) => {

        editingSubject.topicIdList = new Array<string>();
        topics.map((topic) => {
            if (topic.value._id) {
                editingSubject.topicIdList.push(topic.value._id);
            }
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name)
        if(typeof name === "string" && name.includes(".") === true)
            //nested variable
            setEditingSubject((prevData) => ({ ...prevData, supervisor:{...prevData.supervisor,[name.split(".")[name.split(".").length-1]]:value } }));
        else
            setEditingSubject((prevData) => ({ ...prevData, [name]: value }));
      
    };

    //spSubject is more like metadata of what semester and what type is subject
    const selectionChangeHandler = (value) => {

        let f = JSON.parse(JSON.stringify(topics));
        console.log(f);
        console.log(value)
        //Keep other subjects but not those we are adding
        f = [];
        for (let v in value) {
            f.push({ value: value[v].value, label: value[v].label });
        }
        setTopics(f);
    }

    useEffect(() => {
        if (editing_subject) {
            console.log(editing_subject)
            setEditingSubject(editing_subject);
            setTopicSelectionsFromSubject(editing_subject, _topics);
            setTopicsOfEditingSubject(topics);
        }

        //Setting subject options...
        let newOptions: Array<{ value: object, label: string }> = [];
        for (let s in _topics) {
            newOptions.push({ value: _topics[s], label: _topics[s].name })
        }
        setAllTopicOptions(newOptions)

        setModal(modal_props);
    }, [editing_subject, _topics, modal_props])



    return (
        <>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName" className='mt-3'>
                        <Form.Label>{t("form.name")}</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={editingSubject.name}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDescription" className='mt-3'>
                        <Form.Label>{t("form.description")}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={editingSubject.description}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formGoal" className='mt-3'>
                        <Form.Label>{t("form.goal")}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="goal"
                            value={editingSubject.goal}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formLanguage" className='mt-3'>
                        <Form.Label>{t("form.language")}</Form.Label>
                        <Form.Control
                            as="select"
                            name="language"
                            value={editingSubject.language}
                            onChange={handleInputChange}
                        >
                            <option value="">{t("form.chooseLanguage")}</option>
                            <option value="Czech">Czech</option>
                            <option value="English">English</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="formCredits" className='mt-3'>
                        <Form.Label>{t("form.credits")}: <span className='font-bold'>{editingSubject.credits}</span></Form.Label>
                        <Form.Range
                            max={15}
                            min={1}
                            name="credits"
                            value={editingSubject.credits}
                            onChange={handleInputChange}
                        >
                        </Form.Range>
                    </Form.Group>

                    <Form.Group controlId="formSupervisor" className='mt-3'>
                        <Form.Label>{t("form.supervisor.identification")}</Form.Label>
                        <Form.Control
                            as={"input"}
                            name="editingSubject.supervisor._id"
                            value={editingSubject.supervisor._id}
                            onChange={handleInputChange}
                        />
                        <Form.Label>{t("form.supervisor.userName")}</Form.Label>
                        <Form.Control
                            as={"input"}
                            name="editingSubject.supervisor.userName"
                            value={editingSubject.supervisor.userName}
                            onChange={handleInputChange}
                        />

                    </Form.Group>

                    <Form.Group controlId="formTopics" className='mt-3'>
                        <Form.Label>{t("topic.title")}</Form.Label>
                        <Select isMulti={true}
                            hideSelectedOptions={true}
                            onChange={(e) =>
                                selectionChangeHandler(e)
                            }

                            isSearchable={true}
                            options={allTopicOptions}
                            value={topics} />

                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button type="Submit" label={t("modal.save")} on_click_handler={() => {
                     if (modal.confirm_handler) {
                        editingSubject.credits = (typeof editingSubject.credits==="string"?parseInt(editingSubject.credits):editingSubject.credits);
                        setTopicsOfEditingSubject(topics);
                         modal.confirm_handler(editingSubject) } 
                    }} />
                <Button type="Delete" label={t("modal.close")} on_click_handler={() => { if (modal.cancel_handler) modal.cancel_handler() }} />
            </Modal.Footer>
        </>
    );
};

export default SubjectModal;
