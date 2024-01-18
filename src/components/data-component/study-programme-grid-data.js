import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { useAuth0 } from "@auth0/auth0-react";

//Custom components...
import Loading from "../visual-component/Loading";
import ErrorComponent from "../visual-component/Error.component";
import StudyProgrammeGrid from "../visual-component/study-programme-grid";

import axios from "axios";
import { toast } from 'react-toastify';

const apiUrl = process.env.REACT_APP_API_URL;

export default function StudyProgrammeGridData({ token }) {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  const [dataLoadStatus, setDataLoadStatus] = useState("Pending");
  const [errorMessage, setErrorMessage] = useState("");

  const [studyProgrammes, setStudyProgrammes] = useState([]);

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const accessToken = await getAccessTokenSilently();

        const userProfile = await user;
        const userId = user.sub;
        console.log(userProfile);
        console.log(userId);

        const decodedToken = jwtDecode(accessToken);
        setPermissions(decodedToken.permissions);
      } catch (error) {
        console.error("Error during authentication:", error.message);

        toast.error("Error during authentication:", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",

        });
      }
    };


    if (isAuthenticated) {
      handleAuth();
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  useEffect(() => {
    fetch(`${apiUrl}/study-programme/list`, {
      method: "GET",
    })
      .then(async (response) => {
        const responseJson = await response.json();
        console.log(responseJson.result);
        if (response.status >= 400) {
          setDataLoadStatus("Error")
          setErrorMessage("Error getting study pragmmes")
        } else {
          setDataLoadStatus("Loaded")
          setStudyProgrammes(responseJson.result);
        }
      })
      .catch((error) => {
        setDataLoadStatus("Error")
        toast.error("Error Fetching Data", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",

        });
      });


  }, []);

  const handleDeleteProgramme = async (deletedProgramme) => {
    try {
      setDataLoadStatus("Pending")
      console.log(`Programme id to delete`, deletedProgramme);
      const response = await axios.delete(`${apiUrl}/study-programme/delete/${deletedProgramme}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        toast.success("Study programme deleted!", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            window.location.reload();
          },
        });
        console.log('Programme deleted successfully:', response.data.result);
      } else {
        console.error('Failed to delete programme. Response code is not positive:', response.data.response_code);
        toast.error("Deleting programme Failed", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    } catch (error) {
      console.error('Failed to delete programme:', error);
      toast.error("Deleting programme Failed", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    setDataLoadStatus("Loaded")
  }


  return (

    <div className="">
      {
        (dataLoadStatus === "Pending") ?
          <Loading></Loading>
          : (dataLoadStatus === "Error") ?
            <ErrorComponent message={errorMessage}></ErrorComponent> :
            <StudyProgrammeGrid onDelete={handleDeleteProgramme} permissions={permissions} studyProgrammes={studyProgrammes}></StudyProgrammeGrid>

      }


    </div>

  )
}
