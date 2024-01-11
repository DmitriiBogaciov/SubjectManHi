import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditContentModal = ({ show, handleClose, handleSave, content }) => {
  const [editedContent, setEditedContent] = useState(content);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedContent((prevContent) => ({ ...prevContent, [name]: value }));
  };

  const handleSaveClick = () => {
    handleSave(editedContent);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Content</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formContent">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              name="name"
              value={editedContent.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formContent">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              name="description"
              value={editedContent.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formContent">
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter title"
              name="externalLink"
              value={editedContent.externalLink}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveClick}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditContentModal;
