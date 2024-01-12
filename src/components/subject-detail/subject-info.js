import React from 'react';
import { Card } from 'react-bootstrap';

const SubjectInfo = ({ subject }) => {
  return (
    <div style={{maxWidth: "90%", margin: "0 auto"}}>
      <Card style={{backgroundColor: "#BAD9B2"}}>
        <Card.Body>
          <Card.Title>{subject.name}</Card.Title>
          <Card.Text>
            {subject.description}
          </Card.Text>
          <Card.Text>
            <strong>Language:</strong> {subject.language}
          </Card.Text>
          <Card.Text>
            <strong>Degree:</strong> {subject.studyDegree}
          </Card.Text>
          <Card.Text>
            <strong>Credits:</strong> {subject.credits}
          </Card.Text>
          {/*<Card.Text>*/}
          {/*  <strong>Supervisor:</strong> {subject.supervisorId}*/}
          {/*</Card.Text>*/}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SubjectInfo;
