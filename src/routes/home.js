import React, { useEffect, useState } from "react";
import Navbar from "../components/home/navbar";
import { jwtDecode } from "jwt-decode";
import SearchBox from "../components/home/search-box";
import StudyProgrammeGrid from "../components/home/study-programme-grid";
import CreateProgrammeModal from "../components/home/create-programme-modal";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Modal, Form } from "react-bootstrap";
import "../css/home.css";
import axios from "axios";
const apiUrl = process.env.REACT_APP_API_URL;

export default function Home() {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [permissions, setPermissions] = useState([]);
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [token, setToken] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const handleCloseModal = () => setShowCreateModal(false);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const accessToken = await getAccessTokenSilently();

        const userProfile = await user;
        const userId = user.sub;
        console.log(userProfile);
        console.log(userId);

        const decodedToken = jwtDecode(accessToken);
        console.log(decodedToken);
        setPermissions(decodedToken.permissions);
        setToken(accessToken);
      } catch (error) {
        console.error("Error during authentication:", error.message);
      }
    };

    if (isAuthenticated) {
      handleAuth();
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  const handleShowToken = () => setShowTokenModal(true);
  const handleCloseToken = () => setShowTokenModal(false);

  const handleCreateProgramme = async (newProgramme) => {
    try {
      console.log(`New programme to send to server`, newProgramme);
      const response = await axios.post(`${apiUrl}/study-programme/create`, newProgramme, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        console.log('Programme created successfully:', response.data.result);
        window.location.reload();
      } else {
        console.error('Failed to create programme. Response code is not positive:', response.data.response_code);
      }
    } catch (error) {
      console.error('Failed to create programme:', error);
    }
  };

  const handleDeleteProgramme = async (deletedProgramme) => {
    try {
      console.log(`Programme id to delete`, deletedProgramme);
      const response = await axios.delete(`${apiUrl}/study-programme/delete/${deletedProgramme}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        console.log('Programme deleted successfully:', response.data.result);
        window.location.reload();
      } else {
        console.error('Failed to delete programme. Response code is not positive:', response.data.response_code);
      }
    } catch (error) {
    console.error('Failed to delete programme:', error);
    }
  }

  return (
    <div className="home">
      <Navbar
        permissions={permissions}
        onCreate={() => setShowCreateModal(true)}
      />
      <SearchBox />
      <StudyProgrammeGrid
        onDelete = {handleDeleteProgramme}
      />

      {isAuthenticated && (
        <Button
          variant="primary"
          style={{ margin: "20px" }}
          onClick={handleShowToken}
          className="token-button"
        >
          Show Token
        </Button>
      )}

      <CreateProgrammeModal
        show={showCreateModal}
        handleClose={handleCloseModal}
        handleCreateProgramme={handleCreateProgramme}
      />

      <Modal show={showTokenModal} onHide={handleCloseToken}>
        <Modal.Header closeButton>
          <Modal.Title>Access Token</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formToken">
              <Form.Label>Token</Form.Label>
              <Form.Control as="textarea" rows={21} value={token} readOnly />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseToken}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}
