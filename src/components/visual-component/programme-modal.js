import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Select from 'react-select'


const StudyProgrammeModal = ({ show, handleClose, handleCreateProgramme, studyProgramme, handleUpdateProgramme, mode, subjects }) => {
  const [formData, setFormData] = useState({
    _id: undefined,
    name: '',
    description: '',
    language: '',
    degree: '',
    subjectsYear1: [],
    subjectsYear2: [],
    subjectsYear3: [],
    subjectsYear4: [],
  });
  const [subjectOptions, setSubjectOptions] = useState([]);

  useEffect(() => {
    if (studyProgramme) {
      console.log(studyProgramme)
      let newFormData = JSON.parse(JSON.stringify(formData));
      newFormData._id = studyProgramme._id
      newFormData.name = studyProgramme.name
      newFormData.description = studyProgramme.description;
      newFormData.language = studyProgramme.language;
      newFormData.degree = studyProgramme.degree;

      for (let s in studyProgramme.subjects) {

        for (let i in subjects) {

          if (subjects[i]._id && subjects[i]._id === studyProgramme.subjects[s]._id) {
            let subjectEntry = { value: subjects[i]._id, label: subjects[i].name }
            newFormData["subjectsYear" + studyProgramme.subjects[s].year].push(subjectEntry);
          }
        }
      }
      console.log(studyProgramme)
      console.log(newFormData)
      setFormData(newFormData)
    }
  }, [studyProgramme])

  useEffect(() => {

    let newOptions = [];
    for (let s in subjects) {
      newOptions.push({ value: subjects[s].id, label: subjects[s].name })
    }
    setSubjectOptions(newOptions)
  }, [subjects])

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubjectsChange = (e, year) => {

    let f = JSON.parse(JSON.stringify(formData));
    f["subjectsYear" + year] = new Array(...e);
  
    setFormData(f);
  }

  const handleSubmit = () => {
    if (mode === "create")
      handleCreateProgramme(formData);
    if (mode === "update")
      handleUpdateProgramme(formData);
  };

  return (
    <div>
      <Modal.Header closeButton>
        <Modal.Title>Study Programme</Modal.Title>
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

          <Form.Group controlId="formSubjects">
            <Form.Label>Subjects for 1st year</Form.Label>
            <Select isMulti={true} onChange={(e) => handleSubjectsChange(e, 1)} isSearchable={true} options={subjectOptions} value={formData.subjectsYear1}></Select>
          </Form.Group>
          <Form.Group controlId="formSubjects">
            <Form.Label>Subjects for 2nd year</Form.Label>
            <Select isMulti={true} onChange={(e) => handleSubjectsChange(e, 2)} isSearchable={true} options={subjectOptions} value={formData.subjectsYear2}></Select>
          </Form.Group>
          <Form.Group controlId="formSubjects">
            <Form.Label>Subjects for 3rd year</Form.Label>
            <Select isMulti={true} onChange={(e) => handleSubjectsChange(e, 3)} isSearchable={true} options={subjectOptions} value={formData.subjectsYear3}></Select>
          </Form.Group>
          <Form.Group controlId="formSubjects">
            <Form.Label>Subjects for 4th year</Form.Label>
            <Select isMulti={true} onChange={(e) => handleSubjectsChange(e, 4)} isSearchable={true} options={subjectOptions} value={formData.subjectsYear4}></Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Confirm
        </Button>
      </Modal.Footer>
    </div>
  );
};

export default StudyProgrammeModal;
