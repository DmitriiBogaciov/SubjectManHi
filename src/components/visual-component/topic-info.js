import React from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const TopicInfo = ({ topic, permissions, onDelete, onEdit, onClick }) => {
  const handleTopicClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card bg='transparent'>
      <div className="bg-slate-700 p-4 rounded-md text-white">
        <Card.Body onClick={handleTopicClick} style={{ cursor: 'pointer' }}>
          <Card.Title className='text-left '><span className='text-4xl'>{topic.name}</span></Card.Title>
          <Card.Text className='p-4'>
            <div className='text-left'>
              <strong>Description:</strong> {topic.description}
            </div>
          </Card.Text>
        </Card.Body>
        <Card.Text className="d-flex">
          {permissions.includes('update:topic') && (
            <div className="" style={{ margin: "5px" }}>
              <FontAwesomeIcon icon={faPenToSquare} size="lg" onClick={onEdit} />
            </div>
          )}
          {permissions.includes('update:topic') && (
            <div className="" style={{ margin: "5px" }}>
              <FontAwesomeIcon icon={faTrash} size="lg" onClick={onDelete} />
            </div>
          )}
        </Card.Text>
      </div>
    </Card>
  );
};

export default TopicInfo;
