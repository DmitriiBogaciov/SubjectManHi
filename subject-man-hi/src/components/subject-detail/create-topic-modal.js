import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

const CreateTopicModal = ({ show, handleClose, handleCreateTopic }) => {
  const [newTopic, setNewTopic] = useState({
    name: '',
    description: '',
    digitalContentIdList: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTopic((prevTopic) => ({ ...prevTopic, [name]: value }));
  };

  const handleCreateClick = () => {
    handleCreateTopic(newTopic);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Topic</Modal.Title>
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
              value={newTopic.name}
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
              value={newTopic.description}
              onChange={handleChange}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateClick}>
          Create Topic
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateTopicModal;
