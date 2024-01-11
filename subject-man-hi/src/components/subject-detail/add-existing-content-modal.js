import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddExistingContentModal = ({ show, onClose, onSelect }) => {
  const [digitalContents, setDigitalContents] = useState([]);
  const [selectedDigitalContent, setSelectedDigitalContent] = useState('');

  useEffect(() => {
    const fetchDigitalContents = async () => {
      try {
        const response = await axios.get('/digital-content/list');
        console.log('Response from fetching all digital content:', response);

        if (response.status === 200) {
          // Сортируем контент по имени перед установкой в состояние
          const sortedContents = response.data.result.sort((a, b) => a.name.localeCompare(b.name));
          setDigitalContents(sortedContents);
        } else {
          console.error('Failed to fetch digital contents. Status:', response.status);
        }
      } catch (error) {
        console.error('Error fetching digital contents:', error);
      }
    };

    if (show) {
      fetchDigitalContents();
    }
  }, [show]);

  const handleAdd = () => {
    onSelect(selectedDigitalContent);
    onClose();
  };

  return (
    <div>
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Existing Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formDigitalContentSelect">
              <Form.Label>Select Digital Content</Form.Label>
              <Form.Control
                as="select"
                value={selectedDigitalContent}
                onChange={(e) => setSelectedDigitalContent(e.target.value)}
              >
                <option value="" disabled>Select digital content...</option>
                {digitalContents.map((digitalContent) => (
                  <option key={digitalContent._id} value={digitalContent._id}>
                    {digitalContent.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd} disabled={!selectedDigitalContent}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddExistingContentModal;
