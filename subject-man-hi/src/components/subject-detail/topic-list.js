import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopicInfo from './topic-info';
import DigitalContentList from './digital-content-list';
import EditTopicModal from './edit-topic-modal';
import DeleteTopicModal from "./delete-topic-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import AddExistingContentModal from "./add-existing-content-modal";
import CreateDigitalContentModal from "./create-digital-content-modal";
import DeleteModal from "./delete-modal";
import { useAuth0 } from "@auth0/auth0-react";
import {jwtDecode} from "jwt-decode";

const TopicList = ({topicIdList, onCreateTopic, subjectId }) => {
  const [topics, setTopics] = useState([]);
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [openTopics, setOpenTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddExistingContent, setShowAddExistingContent] = useState(false);
  const [showCreateContentModal, setShowCreateContentModal] = useState(false);
  const [showDeleteContentModal, setShowDeleteContentModal] = useState(false);
  const [deletingContent, setDeletingContent] = useState();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        setAccessToken(accessToken);

        const decodedToken = jwtDecode(accessToken);
        console.log(decodedToken);
        setPermissions(decodedToken.permissions);
        console.log('Permissions from token', decodedToken.permissions);

        const response = await axios.get(`/topic/get?topicsIds=${topicIdList.join(',')}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        const contentType = response.headers['content-type'];

        if (!response.status === 200) {
          throw new Error(`Failed to fetch topics. Status: ${response.status}`);
        }

        if (contentType && contentType.includes('application/json')) {
          const fetchedTopics = response.data.result;
          setTopics(fetchedTopics);
          // Initialize the openTopics state with false for each topic
          setOpenTopics(new Array(fetchedTopics.length).fill(false));
        } else {
          console.error('Unexpected content type in response:', contentType);
        }
      } catch (error) {
        console.error(error);
      }
    };

    // if (topicIdList.length > 0) {
      fetchTopics();
    // }
  }, [topicIdList, getAccessTokenSilently]);

  const toggleDigitalContentList = (index) => {
    setOpenTopics((prevOpenTopics) => {
      const newOpenTopics = [...prevOpenTopics];
      newOpenTopics[index] = !newOpenTopics[index];
      return newOpenTopics;
    });
  };

  const handleEditTopic = (topic) => {
    setSelectedTopic(topic);
    setShowEditModal(true);
  };

  const handleDeleteContent = (topic, deletingContent) => {
    setShowDeleteContentModal(true);
    setDeletingContent(deletingContent);
    setSelectedTopic(topic)
  };

  const handleDeleteTopic = (topic) => {
    setSelectedTopic(topic);
    setShowDeleteModal(true);
  };

  const handleAddExistingContent = (topic) => {
    setSelectedTopic(topic);
    setShowAddExistingContent(true);
  }

  const handleAddNewContent = (topic) => {
    setSelectedTopic(topic);
    setShowCreateContentModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedTopic(null);
    setShowEditModal(false);
  };

  const handleSaveTopic = async (editedTopic) => {
    console.log(`Topic data to server`, editedTopic);
    try {
      const response = await axios.put('/topic/update', editedTopic, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log(response.data);

      if (response.data.response_code === 200) {
        setTopics((prevTopics) =>
          prevTopics.map((topic) =>
            topic.id === editedTopic.id ? { ...topic, ...editedTopic } : topic
          )
        );
        handleCloseEditModal();
      } else {
        console.error('Failed to save topic. Response code is not positive:', response.data.response_code);
      }
    } catch (error) {
      console.error('Failed to save topic:', error);
    }
  };

  const deleteTopic = async (deletedTopic) => {
    try {
      const response = await axios.delete(`/topic/delete/${deletedTopic._id}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log(response.data)

      const updatedSubject = {
        id: subjectId,
        topicIdList: topicIdList.filter((topicId) => topicId !== deletedTopic._id),
      };
      console.log(`Update subject after removing topic`, updatedSubject)

      await axios.put('/subject/update', updatedSubject, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });


      setTopics((prevTopics) => prevTopics.filter((t) => t._id !== deletedTopic._id));
      setShowDeleteModal(false);
    } catch (error) {
      console.error(`Failed to delete topic`, error);
    }
  }

  const addExistingContent = async (selectedTopic, existingContentId) => {
    try {
      console.log(`id of content before updating`, existingContentId);
      const updatedTopic = {
        id: selectedTopic._id,
        digitalContentIdList: [...selectedTopic.digitalContentIdList, existingContentId],
      };

      console.log(`Updated topic to save`, updatedTopic)

      const response = await axios.put('/topic/update', updatedTopic, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      console.log(response.data);
      if (response.data.response_code === 200) {
        setTopics((prevTopics) =>
          prevTopics.map((topic) =>
            topic._id === selectedTopic._id ? { ...topic, digitalContentIdList: updatedTopic.digitalContentIdList } : topic
          )
        );

        // Закрываем модальное окно
        setShowAddExistingContent(false);
      } else {
        console.error('Failed to update topic. Response:', response);
      }
    } catch (error) {
      console.error('Failed to add existing content to topic:', error);
    }
  };

  const deleteContent = async () => {
    try {
      console.log(`Digital content to delete`, deletingContent);
      const updatedTopic = {
        id: selectedTopic._id,
        digitalContentIdList: selectedTopic.digitalContentIdList.filter((contentId) => contentId !== deletingContent),
      };

      const response = await axios.put('/topic/update', updatedTopic, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.data.response_code === 200) {
        console.log('Topic updated successfully:', response.data);

        setTopics((prevTopics) =>
          prevTopics.map((topic) =>
            topic._id === selectedTopic._id ? { ...topic, digitalContentIdList: updatedTopic.digitalContentIdList } : topic
          )
        );

      } else {
        console.error('Failed to update topic. Status:', response.status);
      }

      setShowDeleteContentModal(false);
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  return (
    <div style={{ marginTop: '20px', maxWidth: "90%", margin: "0 auto", }}>
      <h2 style={{ marginBottom: '10px' }}>Learning materials</h2>
      {permissions.includes('create:topic') && (
          <Button className="d-flex align-items-center" style={{marginLeft: "0px", marginBottom: "8px"}} variant="outline-dark" size="sm" onClick={() => onCreateTopic()}>
            <FontAwesomeIcon icon={faPlus} size="lg" style={{marginRight: "2px"}}/>
            New
          </Button>
      )}
      {Array.isArray(topics) && topics.map((topic, index) => (
        <div key={topic._id} style={{marginBottom: "15px"}}>
          <TopicInfo
            topic={topic}
            permissions={permissions}
            onClick={() => toggleDigitalContentList(index)}
            onEdit={() => handleEditTopic(topic)}
            onDelete={() => handleDeleteTopic(topic)}
          />
          {openTopics[index] && (
            isAuthenticated ? (
              <DigitalContentList
                accessToken={accessToken}
                permissions={permissions}
                digitalContentIdList={topic.digitalContentIdList}
                onAddExistingContent={() => handleAddExistingContent(topic)}
                onAddNewContent={() => handleAddNewContent(topic)}
                onDeleteContent={(deletedContentId) => handleDeleteContent(topic, deletedContentId)}
              />
            ) : (
              <p>Please log in to see the content.</p>
            )
          )}
        </div>
      ))}

      {selectedTopic && (
        <EditTopicModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          handleSave={handleSaveTopic}
          topic={selectedTopic}
        />
      )}
      {selectedTopic && (
        <DeleteTopicModal
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleDeleteTopic={() => deleteTopic(selectedTopic)}
        />
      )}
      {selectedTopic && (
        <AddExistingContentModal
          show={showAddExistingContent}
          onClose={() => setShowAddExistingContent(false)}
          onSelect={(existingContent) => addExistingContent(selectedTopic, existingContent)}
        />
      )}
      {selectedTopic && (
        <CreateDigitalContentModal
          accessToken={accessToken}
          show={showCreateContentModal}
          onClose={() => setShowCreateContentModal(false)}
          onCreateDigitalContent={(newContent) => addExistingContent(selectedTopic, newContent)}
        />
      )}
      {selectedTopic && (
        <DeleteModal
          value={"digital content"}
          show={showDeleteContentModal}
          handleClose={() => setShowDeleteContentModal(false)}
          handleDelete={() => deleteContent()}
        />
      )}
    </div>
  );
};

export default TopicList;
