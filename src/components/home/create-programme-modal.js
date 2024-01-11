import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const CreateProgrammeModal = ({ show, handleClose, handleCreateProgramme }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: '',
    degree: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = () => {
    handleCreateProgramme(formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Programme</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter programme name"
              name="name"
              value={formData.name}
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
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group controlId="formLanguage">
            <Form.Label>Language</Form.Label>
            <Form.Control
              as="select"
              name="language"
              value={formData.language}
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
              value={formData.degree}
              onChange={handleInputChange}
            >
              <option value="">Choose degree</option>
              <option value="Bachelor">Bachelor</option>
              <option value="Master">Master</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateProgrammeModal;
