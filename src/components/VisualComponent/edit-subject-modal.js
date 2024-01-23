import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditSubjectModal = ({ show, handleClose, handleEditSubject, subject }) => {
  const [editedSubject, setEditedSubject] = useState({ ...subject });

  useEffect(() => {
    if (subject) {
      const { _id, ...rest } = subject;
      setEditedSubject({ id: _id, ...rest });
    }
  }, [subject]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditedSubject((prevSubject) => ({
      ...prevSubject,
      [name]: value,
    }));

    console.log('Edited Subject:', editedSubject);
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseInt(value, 10);

    setEditedSubject((prevSubject) => ({
      ...prevSubject,
      [name]: isNaN(numericValue) ? '' : numericValue,
    }));

    console.log('Edited Subject:', editedSubject);
  };

  const handleLanguageChange = (value) => {
    setEditedSubject((prevSubject) => ({
      ...prevSubject,
      language: value,
    }));
  };

  const handleDegreeChange = (value) => {
    setEditedSubject((prevSubject) => ({
      ...prevSubject,
      studyDegree: value,
    }));
  };

  const handleEditClick = () => {
    handleEditSubject(editedSubject);
    handleClose();
  };

  return (

    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Subject</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {subject && (
          <Form>
            <Form.Group controlId="formSubjectName">
              <Form.Label>Subject Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editedSubject.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSubjectDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editedSubject.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSubjectSupervisorId">
              <Form.Label>SupervisorId</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="supervisorId"
                value={editedSubject.supervisorId}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSubjectGoal">
              <Form.Label>Goal</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="goal"
                value={editedSubject.goal}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSubjectCredits">
              <Form.Label>Credits</Form.Label>
              <Form.Control
                type="number"
                name="credits"
                value={editedSubject.credits}
                onChange={handleNumberChange}
                min={1}
                max={15}
              />
            </Form.Group>
            <Form.Group controlId="formSubjectLanguage">
              <Form.Label>Language</Form.Label>
              <Form.Control
                as="select"
                name="language"
                value={editedSubject.language}
                onChange={(e) => handleLanguageChange(e.target.value)}>
                <option value="English">English</option>
                <option value="Czech">Czech</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSubjectStudyDegree">
              <Form.Label>Study Degree</Form.Label>
              <Form.Control
                as="select"
                name="studyDegree"
                value={editedSubject.studyDegree}
                onChange={(e) => handleDegreeChange(e.target.value)}>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
              </Form.Control>
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleEditClick}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditSubjectModal;
