import React, { useEffect, useState } from "react";
import Navbar from "../components/visual-component/navbar-home";
import { jwtDecode } from "jwt-decode";


import StudyProgrammeGridData from "../components/data-component/study-programme-grid-data";
import CreateProgrammeModalData from "../components/data-component/programme-modal-data";


import { useAuth0 } from "@auth0/auth0-react";
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




  return (
    <main className="container bg-slate-900 pt-3">
      <Navbar
        permissions={permissions}
        onCreate={() => setShowCreateModal(true)}
      />

      <StudyProgrammeGridData
        token={token}
      />

      

      <CreateProgrammeModalData
        show={showCreateModal}
        handleClose={handleCloseModal}
        token={token}
        mode={"create"}
      />

     
      <ToastContainer/>
    </main>
  );
}
