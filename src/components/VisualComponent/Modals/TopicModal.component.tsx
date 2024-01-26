import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

//Components
import { Modal, Form, Tab, Tabs, Row, Col, Nav } from "react-bootstrap";
import Select from 'react-select'

//Custom components
import Button from '../Button.component.tsx';

//Props
import { ModalDataProps } from '../../../props/nonVisual/Modal.dataprops.tsx';
import { TopicDataProps } from '../../../props/nonVisual/Topic.dataprops.tsx';
import { DigitalContentDataProps } from '../../../props/nonVisual/DigitalContent.dataprops.tsx';

const TopicModal = ({ modal_props, editing_topic, _digitalContents }: { modal_props: ModalDataProps, editing_topic?: TopicDataProps, _digitalContents: Array<DigitalContentDataProps> }) => {
    const [modal, setModal] = useState<ModalDataProps>(modal_props)
    const [editingTopic, setEditingTopic] = useState<TopicDataProps>
        ((editing_topic) ? editing_topic :
            {
                description: "",
                name: "",
                digitalContentIdList: []
            });

    const [digitalContents, setDigitalContents] = useState<Array<{ value: object, label: string }>>([])

    const [allDigitalContentOptions, setAllDigitalContentOptions] = useState<Array<{ value: object, label: string }>>([]);

    const { t } = useTranslation();

    //Setting digitalContents into selection fields 
    const setDigitalContentSelectionsFromTopic = (topic: TopicDataProps, allDigitalContents: Array<DigitalContentDataProps>) => {

        if (topic) {
            console.log(topic)

            //First clear inputs
            let newDigitalContents: Array<{ value: object, label: string }> = [];
            for (let s in topic.digitalContentIdList) {
                for (let i in allDigitalContents) {
                    if (allDigitalContents[i]._id && allDigitalContents[i]._id === topic.digitalContentIdList[s]) {
                        console.log(allDigitalContents[i])
                        newDigitalContents.push({
                            value: allDigitalContents[i], label: allDigitalContents[i].name
                        })
                    }
                }
            }
            setDigitalContents(newDigitalContents);
        }

    }

    const setDigitalContentsOfEditingTopic = (digitalContents: Array<{ value: object, label: string }>) => {

        editingTopic.digitalContentIdList = new Array<string>();
        digitalContents.map((topic) => {
            if (topic.value._id) {
                editingTopic.digitalContentIdList.push(topic.value._id);
            }
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingTopic((prevData) => ({ ...prevData, [name]: value }));
    };

    //spTopic is more like metadata of what semester and what type is topic
    const selectionChangeHandler = (value) => {

        let f = JSON.parse(JSON.stringify(digitalContents));
        console.log(f);
        console.log(value)
        //Keep other digitalContents but not those we are adding
        f = [];
        for (let v in value) {
            f.push({ value: value[v].value, label: value[v].label });
        }
        setDigitalContents(f);
    }

    useEffect(() => {
        if (editing_topic) {
            console.log(editing_topic)
            setEditingTopic(editing_topic);
            setDigitalContentSelectionsFromTopic(editing_topic, _digitalContents);
            setDigitalContentsOfEditingTopic(digitalContents);
        }

        //Setting topic options...
        let newOptions: Array<{ value: object, label: string }> = [];
        for (let s in _digitalContents) {
            newOptions.push({ value: _digitalContents[s], label: _digitalContents[s].name })
        }
        setAllDigitalContentOptions(newOptions)

        setModal(modal_props);
    }, [editing_topic, _digitalContents, modal_props])



    return (
        <>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formName" className='mt-3'>
                        <Form.Label>{t("form.name")}</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={editingTopic.name}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDescription" className='mt-3'>
                        <Form.Label>{t("form.description")}</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={editingTopic.description}
                            onChange={handleInputChange}
                        />
                    </Form.Group>

                    <Form.Group controlId="formDigitalContents" className='mt-3'>
                        <Form.Label>{t("digitalContent.title")}</Form.Label>
                        <Select isMulti={true}
                            hideSelectedOptions={true}
                            onChange={(e) =>
                                selectionChangeHandler(e)
                            }

                            isSearchable={true}
                            options={allDigitalContentOptions}
                            value={digitalContents} />

                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button type="Submit" label={t("modal.save")} on_click_handler={() => {
                     if (modal.confirm_handler) {
                        setDigitalContentsOfEditingTopic(digitalContents);
                         modal.confirm_handler(editingTopic) } 
                    }} />
                <Button type="Delete" label={t("modal.close")} on_click_handler={() => { if (modal.cancel_handler) modal.cancel_handler() }} />
            </Modal.Footer>
        </>
    );
};

export default TopicModal;
