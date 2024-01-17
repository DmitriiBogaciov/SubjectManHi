import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState } from "react";

import { jwtDecode } from "jwt-decode";
import { useAuth0 } from "@auth0/auth0-react";

//Custom components...
import LoadingComponent from "../visual-component/Loading.component";
import Error_component from "../visual-component/Error.component";
import StudyProgrammeGrid from "../visual-component/study-programme-grid";

const apiUrl = process.env.REACT_APP_API_URL;

export default function StudyProgrammeGridData({ onDelete }) {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [dataLoadStatus, setDataLoadStatus] = useState("Pending");

  const [studyProgrammes, setStudyProgrammes] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProgramme, setSelectedProgramme] = useState(null)
  const [programmesLoadCall, setProgrammesLoadCall] = useState({
    state: "pending",
  });

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
          setProgrammesLoadCall({ state: "error", error: responseJson });
        } else {
          setProgrammesLoadCall({ state: "success", data: responseJson });
          setStudyProgrammes(responseJson.result);
        }
      })
      .catch((error) => {
        setProgrammesLoadCall({ state: "error", error: error.message });
      });
  }, []);

  return (
    <div className="flex justify-center">
      {

        <StudyProgrammeGrid onDelete={onDelete}></StudyProgrammeGrid>

      }

    </div>
  )
}
