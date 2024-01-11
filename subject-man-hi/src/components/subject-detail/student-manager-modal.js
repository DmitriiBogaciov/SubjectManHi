import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const StudentManagerModal = ({ show, handleClose, handleEditSubject, subject }) => {
  const [editedSubject, setEditedSubject] = useState({
    id: subject ? subject._id : '',
    students: subject ? subject.students || [] : [],
  });

  const [newStudent, setNewStudent] = useState('');

  useEffect(() => {
    if (subject) {
      setEditedSubject({
        id: subject._id,
        students: subject.students || [],
      });
    }
  }, [subject]);

  const handleRemoveStudent = (studentToRemove) => {
    const updatedStudents = editedSubject.students.filter((student) => student !== studentToRemove);
    setEditedSubject({
      ...editedSubject,
      students: updatedStudents,
    });
  };

  const handleAddStudent = () => {
    if (newStudent.trim() !== '') {
      setEditedSubject({
        ...editedSubject,
        students: [...editedSubject.students, newStudent.trim()],
      });
      setNewStudent('');
    }
  };

  const handleSaveChanges = () => {
    handleEditSubject(editedSubject);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Student manager</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="newStudentInput" style={{marginBottom: "15px"}}>
          <div className="row">
            <Form.Control className="col"
              type="text"
              placeholder="Enter student id"
              value={newStudent}
              onChange={(e) => setNewStudent(e.target.value)}
            />
            <Button className="col" style={{maxWidth: "60px", marginLeft: "5px"}} variant="primary" onClick={handleAddStudent}>
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>
        </Form.Group>
        {editedSubject.students.map((student) => (
          <div className="row" key={student}
               style={{
                 borderBottom: "1px solid #ccc",
                 marginBottom: "8px",
                 paddingBottom: "8px"
               }}>
            <div className="col-8">{student}</div>
            <div className="col-4">
              <FontAwesomeIcon
                className="col"
                icon={faTrash}
                onClick={() => handleRemoveStudent(student)}
              />
            </div>
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudentManagerModal;
