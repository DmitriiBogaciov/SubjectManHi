import "bootstrap/dist/css/bootstrap.css";
import React, { useEffect, useState } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";

import { Link } from "react-router-dom";
import DeleteModal from "./delete-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { jwtDecode } from "jwt-decode";
import { useAuth0 } from "@auth0/auth0-react";
const apiUrl = process.env.REACT_APP_API_URL;

export default function StudyProgrammeGrid({ permissions, onDelete, studyProgrammes }) {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [study_programmes, set_study_programmes] = useState(studyProgrammes);
  const [_permissions, set_permissions] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedProgramme, setSelectedProgramme] = useState(null)


  useEffect(() => {
    set_permissions(permissions)
  }, [permissions])

  useEffect(() => {
    set_study_programmes(studyProgrammes)
  }, [studyProgrammes])



  function getChild() {

    return (
      <div className="text-center bg-slate-500 p-4 text-white ">
        <div className="row">
          <div className="col">
            <p className="p-4 text-2xl uppercase drop-shadow-lg">
              Study programmes
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1">
          {studyProgrammes.map((programme, index) => (

            <div key={programme._id} 
            className="m-2 bg-slate-800 rounded-lg relative shadow-lg hover:scale-[1.02] transition-[250ms] drop-shadow-lg cursor-pointer card-container">
              <Link
                to={"/program/" + programme._id}
                style={{ textDecoration: "none", color: "inherit" }}
              >

                <div className="col">
                  <p className="text-xl uppercase drop-shadow-lg p-3 mb-2 text-white card-header">
                    {programme.name}
                  </p>
                  <p className="fs-8 p-3 mb-2 card-description">
                    {programme.description}
                  </p>
                </div>
              </Link>
              {_permissions.includes('delete:programmes') && (
                <div className="absolute right-2 bottom-2  hover:scale-[1.25] transition-[250ms] drop-shadow-lg cursor-pointer">
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
          value={"Study Programme"}
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          handleDelete={() => onDelete(selectedProgramme)}
        />
      </div>
    );

  }

  return <div>{getChild()}</div>;
}
