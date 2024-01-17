import React, { useEffect, useState } from "react";
import Navbar from "../components/visual-component/navbar-home";
import { jwtDecode } from "jwt-decode";
import SearchBox from "../components/visual-component/search-box";

import StudyProgrammeGridData from "../components/data-component/study-programme-grid-data";
import CreateProgrammeModalData from "../components/data-component/programme-modal-data";


import { useAuth0 } from "@auth0/auth0-react";
import { Button, Modal, Form } from "react-bootstrap";
import "../css/home.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const apiUrl = process.env.REACT_APP_API_URL;

export default function Home() {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [permissions, setPermissions] = useState([]);

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
    <main className="container bg-slate-900 pt-3">
      <Navbar
        permissions={permissions}
        onCreate={() => setShowCreateModal(true)}
      />

      <StudyProgrammeGridData
        onDelete = {handleDeleteProgramme}
      />

      

      <CreateProgrammeModalData
        show={showCreateModal}
        handleClose={handleCloseModal}
        token={token}
      />

     
      <ToastContainer/>
    </main>
  );
}
