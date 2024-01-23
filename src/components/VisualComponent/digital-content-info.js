import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

const DigitalContentInfo = ({ permissions, digitalContent, onDeleteContent, onEditContent }) => {
  return (
    <Card bg='transparent' className="d-flex">
      <div className='bg-slate-600 rounded-lg shadow-lg text-white no-underline'>
        <Card.Link className='text-white no-underline' href={digitalContent.externalLink} target="_blank" rel="noopener noreferrer">
          <Card.Body>
            <Card.Title style={{ fontSize: '1rem' }}>{digitalContent.name}</Card.Title>
            <Card.Text style={{ fontSize: '0.8rem' }}>{digitalContent.description}</Card.Text>
          </Card.Body>
        </Card.Link>
        <Card.Text className="d-flex">
          {permissions.includes('update:digitalContent') && (
              <div className="row">
              <div className="col" style={{ margin: "5px" }}>
                <FontAwesomeIcon onClick={onEditContent} icon={faPenToSquare} size="lg" />
              </div>
            </div>
          )}
          {permissions.includes('update:topic') && (
            <div className="row">
              <div className="col" style={{ margin: "5px" }}>
                <FontAwesomeIcon onClick={onDeleteContent} icon={faTrash} size="lg" />
              </div>
            </div>
          )}
        </Card.Text>
      </div>
    </Card>
  );
};

export default DigitalContentInfo;
