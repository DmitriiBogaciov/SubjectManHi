import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditProgramModal = ({ show, handleClose, data, setData }) => {

    const [editedProgram, setEditedProgram] = useState(data)


    useEffect(() => {
        setEditedProgram(data)
    }, [data])

    const handleEditClick = () => {
        setData(editedProgram);
        handleClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setEditedProgram((prevProgram) => ({
            ...prevProgram,
            [name]: value,
        }))
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Subject</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formProgramName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={editedProgram?.name}
                            onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formProgramDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Description"
                            name="description"
                            value={editedProgram?.description}
                            onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formProgramDegree">
                        <Form.Label>Degree</Form.Label>
                        <Form.Control
                            as="select"
                            name="degree"
                            onChange={handleChange}>
                            <option value="">Choose degree</option>
                            <option value="Bachelor">Bachelor</option>
                            <option value="Master">Master</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formProgramLanguage">
                        <Form.Label>Language</Form.Label>
                        <Form.Control
                            as="select"
                            name="language"
                            onChange={handleChange}>
                            <option value="">Choose degree</option>
                            <option value="English">English</option>
                            <option value="Czech">Czech</option>
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleEditClick}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>)
}
export default EditProgramModal;

