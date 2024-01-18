import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DigitalContentInfo from './digital-content-info';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from "react-bootstrap";
import EditContentModal from "./edit-digital-content-modal";
const apiUrl = process.env.REACT_APP_API_URL;

const DigitalContentList = ({accessToken, permissions, digitalContentIdList, onAddExistingContent, onAddNewContent, onDeleteContent, onEditContent}) => {
  const [digitalContents, setDigitalContents] = useState([]);
  const [showEditContentModal, setShowEditContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);

  const handleEditContent = (digitalContent) => {
    setEditingContent(digitalContent);
    setShowEditContentModal(true);
  };

  useEffect(() => {
    const fetchDigitalContents = async () => {
      try {
        console.log(`digital contents id to load`, digitalContentIdList)
        const response = await axios.get(`${apiUrl}/digital-content/get?digitalContentIds=${digitalContentIdList.join(',')}`);
        console.log(`Response from fetching digital content by ids`, response);
        const contentType = response.headers['content-type'];

        if (!response.status === 200) {
          throw new Error(`Failed to fetch digital contents. Status: ${response.status}`);
        }

        if (contentType && contentType.includes('application/json')) {
          const fetchedDigitalContents = response.data.result;
          setDigitalContents(fetchedDigitalContents);
        } else {
          console.error('Unexpected content type in response:', contentType);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (digitalContentIdList.length > 0) {
      fetchDigitalContents();
    }
  }, [digitalContentIdList]);

  const handleSaveContent = async (editedContent) => {
    try {
      // Replace _id with id
      const contentToSend = { ...editedContent, id: editedContent._id };
      delete contentToSend._id;

      const response = await axios.put(`${apiUrl}/digital-content/update`, contentToSend, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.data.response_code === 200) {
        console.log('Digital content updated successfully:', response.data);

        setDigitalContents((prevContents) =>
          prevContents.map((content) =>
            content._id === editedContent._id ? { ...content, ...editedContent } : content
          )
        );
        setShowEditContentModal(false);
      } else {
        console.error('Failed to update digital content. Status:', response.status);
      }
    } catch (error) {
      console.error('Error updating digital content:', error);
    }
  };

  return (
    <div className='bg-slate-500 p-2'>
      <div className="d-flex ">
        {permissions.includes('update:topic') && (
        <Button onClick={onAddExistingContent} style={{marginLeft: "0px", marginBottom: "5px", marginTop: "5px"}} variant="outline-dark" size="sm">+</Button>
        )}
        {permissions.includes('create:digitalContent') && (
          <Button onClick={onAddNewContent} style={{marginLeft: "5px", marginBottom: "5px", marginTop: "5px"}} variant="outline-dark" size="sm">Create</Button>
        )}
      </div>
      <div className="row">
        {digitalContents.map((digitalContent) => (
          <div key={digitalContent._id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <DigitalContentInfo
              permissions={permissions}
              digitalContent={digitalContent}
              onDeleteContent={() => onDeleteContent(digitalContent._id)}
              onEditContent={() => handleEditContent(digitalContent)}
            />
          </div>
        ))}
      </div>

      {editingContent && (
        <EditContentModal
          show={showEditContentModal}
          handleClose={() => setShowEditContentModal(false)}
          handleSave={handleSaveContent}
          content={editingContent}
        />
      )}
    </div>
  );
};

export default DigitalContentList;
