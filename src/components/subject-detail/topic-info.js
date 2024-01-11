import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';

const TopicInfo = ({ topic, permissions, onDelete, onEdit, onClick }) => {
  const handleTopicClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Card style={{backgroundColor: "#D7FFF1"}}>
      <Card.Body onClick={handleTopicClick} style={{ cursor: 'pointer' }}>
        <Card.Title>{topic.name}</Card.Title>
        <Card.Text>
          <strong>Description:</strong> {topic.description}
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
    </Card>
  );
};

export default TopicInfo;
