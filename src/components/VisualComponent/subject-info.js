import React from 'react';
import { Card } from 'react-bootstrap';

const SubjectInfo = ({ subject }) => {
  return (
    <Card bg='transparent'>
      <div className='bg-slate-800 text-white text-left p-4'>
        <Card.Body>
          <Card.Title><span className='text-4xl uppercase font-thin border-b-[1px]'> {subject.name} </span></Card.Title>
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
      </div>
    </Card>
  );
};

export default SubjectInfo;
