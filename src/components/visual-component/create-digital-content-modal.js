import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;

const CreateDigitalContentModal = ({accessToken, show, onClose, onCreateDigitalContent }) => {
  const [contentName, setContentName] = useState('');
  const [contentDescription, setContentDescription] = useState('');
  const [contentExternalLink, setContentExternalLink] = useState('');

  const handleCreate = async () => {
    try {
      const response = await axios.post(`${apiUrl}/digital-content/create`, {
        name: contentName,
        description: contentDescription,
        externalLink: contentExternalLink,
      }, {headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      onClose();
      console.log(`inserted id of content`, response.data.result.insertedId)
      onCreateDigitalContent(response.data.result.insertedId);

    } catch (error) {
      console.error('Failed to create digital content:', error);
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Digital Content</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formDigitalContentName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter content name"
              value={contentName}
              onChange={(e) => setContentName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDigitalContentDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter content description"
              value={contentDescription}
              onChange={(e) => setContentDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formDigitalContentExternalLink">
            <Form.Label>External Link</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter external link"
              value={contentExternalLink}
              onChange={(e) => setContentExternalLink(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleCreate} disabled={!contentName}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateDigitalContentModal;
