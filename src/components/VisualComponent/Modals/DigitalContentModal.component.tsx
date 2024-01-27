import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

//Components
import { Modal, Form, Tab, Tabs, Row, Col, Nav } from "react-bootstrap";
import Select from 'react-select'

//Custom components
import Button from '../Button.component.tsx';

//Props
import { ModalDataProps } from '../../../props/nonVisual/Modal.dataprops.tsx';
import { DigitalContentDataProps } from '../../../props/nonVisual/DigitalContent.dataprops.tsx';

const DigitalContentModal = ({ modal_props, editing_digitalContent }: { modal_props: ModalDataProps, editing_digitalContent?: DigitalContentDataProps }) => {
    const [modal, setModal] = useState<ModalDataProps>(modal_props)
    const [editingDigitalContent, setEditingDigitalContent] = useState<DigitalContentDataProps>
        ((editing_digitalContent) ? editing_digitalContent :
            {
                name: "",
                description: "",
                externalLink: ""
            });


    const { t } = useTranslation();





    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditingDigitalContent((prevData) => ({ ...prevData, [name]: value }));
    };

    useEffect(() => {
        if (editing_digitalContent) {
            setEditingDigitalContent(editing_digitalContent);
        }

        setModal(modal_props);
    }, [editing_digitalContent, modal_props])


    return (
        <>
            <Modal.Body>
                {
                    (modal.type === "View") ?
                        <div>
                            <div className='mb-4'>
                                <p className='text-lg font-bold'>{t("form.name")}</p>
                                <p>{editingDigitalContent.name}</p>
                            </div>
                            <div className='mb-4'>
                                <p className='text-lg font-bold'>{t("form.description")}</p>
                                <p>{editingDigitalContent.description}</p>
                            </div>
                            <div>
                                <p className='text-lg font-bold'>{t("form.externalLink")}</p>
                                <a className='underline break-all' href={editingDigitalContent.externalLink}>{editingDigitalContent.externalLink}</a>
                            </div>
                        </div> :
                        <Form>
                            <Form.Group controlId="formName" className='mt-3'>
                                <Form.Label>{t("form.name")}</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={editingDigitalContent.name}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formDescription" className='mt-3'>
                                <Form.Label>{t("form.description")}</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    value={editingDigitalContent.description}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formLink" className='mt-3'>
                                <Form.Label>{t("form.externalLink")}</Form.Label>
                                <Form.Control
                                    as="input"
                                    name="externalLink"
                                    value={editingDigitalContent.externalLink}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        </Form>
                }
            </Modal.Body>

            <Modal.Footer>
                {
                    (modal.type !== "View") ?
                        <Button type="Submit" label={t("modal.save")} on_click_handler={() => {
                            if (modal.confirm_handler) {
                                modal.confirm_handler(editingDigitalContent)
                            }
                        }} /> :
                        null
                }
                <Button type="Delete" label={t("modal.close")} on_click_handler={() => { if (modal.cancel_handler) modal.cancel_handler() }} />
            </Modal.Footer>
        </>
    );
};

export default DigitalContentModal;
