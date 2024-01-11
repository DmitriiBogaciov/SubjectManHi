import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const DeleteTopicModal = ({ show, handleClose, handleDeleteTopic, confirmationMessage }) => {
  const handleDeleteClick = () => {
    handleDeleteTopic();
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>{confirmationMessage || 'Are you sure you want to delete this topic?'}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="danger" onClick={handleDeleteClick}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteTopicModal;
