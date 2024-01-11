import React, { useEffect, useState } from "react";
import { useParams, useNavigate} from 'react-router-dom';
import Navbar from "../components/subject-detail/navbar";
import {jwtDecode} from "jwt-decode";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import SubjectInfo from '../components/subject-detail/subject-info';
import TopicList from '../components/subject-detail/topic-list';
import CreateTopicModal from '../components/subject-detail/create-topic-modal';
import EditSubjectModal from "../components/subject-detail/edit-subject-modal";
import DeleteModal from "../components/subject-detail/delete-modal";
import StudentManagerModal from "../components/subject-detail/student-manager-modal";

export default function SubjectDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [subject, setSubject] = useState(null);
    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
    const [permissions, setPermissions] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false); //Topic
    const [showEditModal, setShowEditModal] = useState(false); //Subject
    const [showDeleteModal, setShowDeleteModal] = useState(false); //Subject
    const [accessToken, setAccessToken] = useState('');
    const [showStudentManagerModal, setShowStudentManagerModal] = useState(false);

    useEffect(() => {
        const handleAuth = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                setAccessToken(accessToken);

                const userProfile = await user;
                console.log(userProfile);

                const decodedToken = jwtDecode(accessToken);
                console.log(decodedToken);
                setPermissions(decodedToken.permissions);
                console.log('Permissions from token', decodedToken.permissions);
            } catch (error) {
                console.error("Error during authentication:", error.message);
            }
        };

        if (isAuthenticated) {
            handleAuth();
        }
    }, [isAuthenticated, user, getAccessTokenSilently]);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await axios.get(`/subject/get?subjectIds=${id}`);
                console.log(`Response from subject/get`, response);

                const contentType = response.headers["content-type"];

                if (!response.data.response_code === 200) {
                    throw new Error(`Failed to fetch subjects. Status: ${response.status}`);
                }

                if (contentType && contentType.includes("application/json")) {
                    const subjects = response.data.result;
                    const subject = subjects.length > 0 ? subjects[0] : null;
                    setSubject(subject);
                    console.log(`This is subject:`, subject);
                } else {
                    console.error("Unexpected content type in response:", contentType);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchSubjects();
    }, [id]);

    const handleCreateTopic = async (newTopic) => {
        try {
            console.log('New topic to send to server', newTopic)
            const response = await axios.post('/topic/create', newTopic, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(response.data);

            if (response.data.response_code === 200) {
                const newTopicId = response.data.result.id;
                const updatedSubjectResponse = await axios.put('/subject/update', {
                    id: subject._id,
                    topicIdList: [...subject.topicIdList, newTopicId]
                }, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }});

                if (updatedSubjectResponse.data.response_code === 200) {
                    setSubject((prevSubject) => ({
                        ...prevSubject,
                        topicIdList: [...prevSubject.topicIdList, newTopicId],
                    }));

                    setShowCreateModal(false);
                } else {
                    console.error('Failed to update subject. Response code is not positive:', updatedSubjectResponse.data.response_code);
                }
            } else {
                console.error('Failed to create topic. Response code is not positive:', response.data.response_code);
            }
        } catch (error) {
            // Обработка ошибок запроса
            console.error('Failed to create topic:', error);
        }
    };


    const handleEditSubject = async (editedSubject) => {
        try {
            const response = await axios.put(`/subject/update`, editedSubject, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            console.log(response.data);

            if (response.data.response_code === 200) {
                setSubject(response.data.result);
                setShowEditModal(false);
            } else {
                console.error('Failed to edit subject. Response code is not positive:', response.data.response_code);
            }
        } catch (error) {
            console.error('Failed to edit subject', error);
        }
    };

    const handleDeleteSubject = async () => {
        try {
            const response = await axios.delete(`/subject/delete/${subject._id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(response.data);

            navigate('/');

        } catch (error) {
            console.error('Failed to delete subject', error);
        }
    };

    return (
      <div className="SubjectDetail">
          <Navbar
            permissions={permissions}
            onEditSubject={() => setShowEditModal(true)}
            onDeleteSubject={() => setShowDeleteModal(true)}
            onManageStudents={() => setShowStudentManagerModal(true)}
          />
          {subject &&
            <>
                <SubjectInfo subject={subject} />
                <TopicList
                  topicIdList={subject.topicIdList}
                  onCreateTopic={() => setShowCreateModal(true)}
                  subjectId={subject._id}
                />
            </>
          }

          <CreateTopicModal
            show={showCreateModal}
            handleClose={() => setShowCreateModal(false)}
            handleCreateTopic={handleCreateTopic}
          />

          <EditSubjectModal
            show={showEditModal}
            handleClose={() => setShowEditModal(false)}
            handleEditSubject={handleEditSubject}
            subject={subject}
          />

          <DeleteModal
            value={"subject"}
            show={showDeleteModal}
            handleClose={() => setShowDeleteModal(false)}
            handleDelete={handleDeleteSubject}
          />

          <StudentManagerModal
            show={showStudentManagerModal}
            handleClose={() => setShowStudentManagerModal(false)}
            handleEditSubject={handleEditSubject}
            subject={subject}
          />
      </div>
    );
}