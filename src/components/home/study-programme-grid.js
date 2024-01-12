import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import styles from "./programmes.module.css";
import { Link } from "react-router-dom";
import DeleteModal from "./delete-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { useAuth0 } from "@auth0/auth0-react";

export default function StudyProgrammeGrid({onDelete}) {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
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
        setToken(accessToken);
      } catch (error) {
        console.error("Error during authentication:", error.message);
      }
    };

    if (isAuthenticated) {
      handleAuth();
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);

  useEffect(() => {
    fetch("/study-programme/list", {
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

  function getChild() {
    switch (programmesLoadCall.state) {
      case "pending":
        return (
          <div className={styles.loading}>
            <Icon size={2} path={mdiLoading} spin={true} />
          </div>
        );
      case "success":
        return (
          <div className="container text-center">
            <div className="row">
              <div className="col">
                <p className="fs-2 fw-bold text-white bg-dark bg-gradient">
                  Study programmes
                </p>
              </div>
            </div>
            <div className="row row-cols-2">
              {studyProgrammes.map((programme, index) => (
                <div key={programme._id}>
                  <Link
                    to={"/program/" + programme._id}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="col">
                      <p className="fs-4 fw-bold p-3 mb-2 bg-secondary text-white">
                        {programme.name}
                      </p>
                      <p className="fs-8 p-3 mb-2 bg-body-secondary">
                        {programme.description}
                      </p>
                    </div>
                  </Link>
                  {permissions.includes('delete:programmes') && (
                    <div className="d-flex justify-content-end" style={{ margin: "5px" }}>
                      <FontAwesomeIcon
                        onClick={() => {
                          setShowDeleteModal(true);
                          setSelectedProgramme(programme._id);
                        }}
                        icon={faTrash}
                        size="lg"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <DeleteModal
              value = {"Study Programme"}
              show = {showDeleteModal}
              handleClose={() => setShowDeleteModal(false)}
              handleDelete={() => onDelete(selectedProgramme)}
            />
          </div>
        );
      case "error":
        return (
          <div className={styles.error}>
            <div>Failed to load programmes data.</div>
            <br />
            <pre>{JSON.stringify(programmesLoadCall.error, null, 2)}</pre>
          </div>
        );
      default:
        return null;
    }
  }

  return <div>{getChild()}</div>;
}
