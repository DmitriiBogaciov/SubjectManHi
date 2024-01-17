// Navbar.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faUserGraduate } from '@fortawesome/free-solid-svg-icons';

export default function Navbar(props) {
  const { onEditSubject, onDeleteSubject, onManageStudents } = props;

  const handleEditClick = () => {
    if (onEditSubject) {
      onEditSubject();
    }
  };

  const handleDeleteClick = () => {
    if (onDeleteSubject) {
      onDeleteSubject();
    }
  };

  const handleStudentManClick = () => {
    if (onManageStudents) {
      onManageStudents();
    }
  }

  return (
    <div>
      <nav className="navbar" style={{ backgroundColor: '#D7FFF1' }}>
        <div className="container-fluid">
          <form className="d-flex" role="search">
            {props.permissions && props.permissions.includes('create:subject') && (
              <div className="row">
                <div className="col" style={{ margin: '5px' }}>
                  <FontAwesomeIcon icon={faPenToSquare} size="lg" onClick={handleEditClick} />
                </div>
              </div>
            )}
            {props.permissions && props.permissions.includes('delete:subject') && (
              <div className="row">
                <div className="col" style={{ margin: '5px' }}>
                  <FontAwesomeIcon icon={faTrash} size="lg" onClick={handleDeleteClick} />
                </div>
              </div>
            )}
            {props.permissions && props.permissions.includes('update:subject') && (
              <div className="row">
                <div className="col" style={{ margin: '5px' }}>
                  <FontAwesomeIcon size="lg" onClick={handleStudentManClick} icon={faUserGraduate} />
                </div>
              </div>
            )}
          </form>
        </div>
      </nav>
    </div>
  );
}
