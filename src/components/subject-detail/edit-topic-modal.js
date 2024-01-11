import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const EditTopicModal = ({ show, handleClose, handleSave, topic }) => {
  const [editedTopic, setEditedTopic] = useState({
    id: topic._id,
    name: topic.name || '',
    description: topic.description || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTopic((prevTopic) => ({ ...prevTopic, [name]: value }));
  };

  const handleSaveClick = () => {
    handleSave(editedTopic);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Topic</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={editedTopic.name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              value={editedTopic.description}
              onChange={handleChange}
            />
          </div>
        </form>
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

export default EditTopicModal;
