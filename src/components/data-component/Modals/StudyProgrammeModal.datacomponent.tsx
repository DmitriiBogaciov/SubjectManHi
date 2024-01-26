import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';

import StudyProgrammeModal from '../../VisualComponent/Modals/StudyProgrammeModal.component.tsx';
import Loading from '../../VisualComponent/Loading.component.tsx';
import ErrorComponent from '../../VisualComponent/Error.component.tsx';

import { ModalDataProps } from '../../../props/nonVisual/Modal.dataprops.tsx';
import { useAuth0 } from '@auth0/auth0-react';
import { jwtDecode } from 'jwt-decode';

import { StudyProgrammeDataProps } from '../../../props/nonVisual/StudyProgramme.dataprops.tsx';

//API URL of server
import GetApiUrl from '../../../assets/helperFunc/GetApiUrl.helper.tsx';
import { useTranslation } from 'react-i18next';


//mode = "create" | "update"
const StudyProgrammeModalData = ({ modal_props, editing_study_programme_id }: { modal_props: ModalDataProps, editing_study_programme_id?: string }) => {

  const [dataLoadStatus, setDataLoadStatus] = useState("Pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [modal, setModal] = useState<ModalDataProps>(modal_props)
  const [editingStudyProgramme, setEditingStudyProgramme] = useState<StudyProgrammeDataProps>
    (
      {
        description: "",
        language: "Czech",
        name: "",
        studyDegree: "Bachelor",
        subjects: [{_id:"test","semester":"winter","type":"mandatory","year":1}]
      });

  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    //Getting all subjects
    fetch(`${GetApiUrl()}/subject/list`, {
      method: "GET",
    })
      .then(async (response) => {
        const responseJson = await response.json();
        console.log(responseJson.result);
        if (response.status >= 400) {
          setDataLoadStatus("Error")
          setErrorMessage("Error when obtaining subjects")
        } else {
          setDataLoadStatus("Loaded")
          console.log(responseJson.result);
          setSubjects(responseJson.result)
        }
      })
      .catch((error) => {
        setDataLoadStatus("Error")
        toast.error("Error obtaining subjects", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  }, [])

  useEffect(() => {

    if(editing_study_programme_id)
    {
      getStudyProgrammeHandler(editing_study_programme_id).then((value)=>
      {
        if(typeof value === "object" && "studyDegree" in value)
        {
          setEditingStudyProgramme(
            {
              _id:value._id,
              description:value.description,
              language:value.language,
              name:value.name,
              studyDegree:value.studyDegree,
              subjects:[...value.subjects],
            }
          );
        }
        
      })
    }
    else
      setEditingStudyProgramme(      {
        description: "",
        language: "Czech",
        name: "",
        studyDegree: "Bachelor",
        subjects: [{_id:"test","semester":"winter","type":"mandatory","year":1}]
      })
    setModal(modal_props);

  }, [editing_study_programme_id, modal_props])

  const handleClose = () => {
    let a = JSON.parse(JSON.stringify(modal))
    a.show = false;
    setModal(a)
  }

  const getStudyProgrammeHandler = async (studyProgrammeId?:string) => {
    //setDataLoadStatus("Pending");
    if(!studyProgrammeId)
      return;

    try {

      const response = await axios.get(`${GetApiUrl()}/study-programme/get/${studyProgrammeId}`, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });
      console.log(response)
      if (response.data && response.data.response_code === 200) {
        console.log('Programme obtained successfully:', response.data.result);
        return response.data.result;
      } else {
        console.error('Failed to obtain study programme. Response code is not positive:', response.data.response_code);
        setDataLoadStatus("Error");
        toast.error("Something went wrong when creating study programme", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            handleClose();
            setDataLoadStatus("Loaded");
          },
        });
      }
    } catch (error) {
      console.error('Failed to create study programme:', error);
      setDataLoadStatus("Error");
      toast.error("Something went wrong when creating study programme", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose: () => {
          handleClose();
        },
      });
    }
  };

  const createStudyProgrammeHandler = async (newProgramme) => {
    setDataLoadStatus("Pending");
    try {

      console.log(`New programme to send to server`, newProgramme);
      const response = await axios.post(`${GetApiUrl()}/study-programme/create`, newProgramme, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        toast.success("Study Programme Added Successfuly", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            handleClose();
            setDataLoadStatus("Loaded");
            window.location.reload();
          },
        });
      } else {
        toast.error("Something went wrong when creating study programme", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            handleClose();
            setDataLoadStatus("Loaded");
          },
        });
      }
    } catch (error) {
      toast.error("Something went wrong when creating study programme", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose: () => {
          handleClose();
        },
      });
    }
  };

  const updateStudyProgrammeHandler = async (newProgramme) => {
    setDataLoadStatus("Pending");
    try {
      console.log(newProgramme)
      const response = await axios.put(`${GetApiUrl()}/study-programme/update`, newProgramme, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        setDataLoadStatus("Loaded");
        console.log('Programme created successfully:', response.data.result);
        toast.success("Study Programme Updated Successfuly", {
          position: "top-center",
          autoClose: 750,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            window.location.reload();
            handleClose();
          },
        });
      } else {
        console.error('Failed to update study programme. Response code is not positive:', response.data.response_code);
        setDataLoadStatus("Loaded");
        toast.error("Something went wrong when updating study programme", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            handleClose();
            setDataLoadStatus("Loaded");
          },
        });
      }
    } catch (error) {
      console.error('Failed to create programme:', error);
      setDataLoadStatus("Loaded");
      toast.error("Something went wrong when updating study programme", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose: () => {
          handleClose();
          setDataLoadStatus("Loaded");
        },
      });
    }
  };



  return (
    <Modal show={modal.show} >
      <Modal.Header closeButton>
        <Modal.Title>{t("studyProgramme.modal.title")}</Modal.Title>
      </Modal.Header>
      {
        (dataLoadStatus === "Pending") ?
          <Loading></Loading>
          : (dataLoadStatus === "Error") ?
            <ErrorComponent message={errorMessage}></ErrorComponent> :
            <StudyProgrammeModal _subjects={subjects} editing_study_programme={editingStudyProgramme} modal_props={{
              show: modal.show, confirm_handler: (val) => { (val && val._id) ? updateStudyProgrammeHandler(val) : createStudyProgrammeHandler(val); }, type: (editingStudyProgramme._id) ? "Update" : "Create",
              cancel_handler: () => { handleClose() }
            }} ></StudyProgrammeModal>
      }
    </Modal>
  )
};

export default StudyProgrammeModalData;
