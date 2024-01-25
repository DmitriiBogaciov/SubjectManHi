import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';

import StudyProgrammeModal from '../VisualComponent/StudyProgrammeModal.component.tsx';
import Loading from '../VisualComponent/Loading.component.tsx';
import ErrorComponent from '../VisualComponent/Error.component.tsx';

import { ModalDataProps } from '../../props/nonVisual/Modal.dataprops';
import { useAuth0 } from '@auth0/auth0-react';
import { jwtDecode } from 'jwt-decode';

import { StudyProgrammeDataProps } from '../../props/nonVisual/StudyProgramme.dataprops';

//API URL of server
import GetApiUrl from '../../assets/helperFunc/GetApiUrl.helper.tsx';


//mode = "create" | "update"
const StudyProgrammeModalData = ({modal_props, editing_study_programme}:{modal_props:ModalDataProps,editing_study_programme?:StudyProgrammeDataProps}) => {

  const [dataLoadStatus, setDataLoadStatus] = useState("Pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [modal, setModal] = useState<ModalDataProps>(modal_props)
  const { loginWithRedirect, getAccessTokenSilently, isAuthenticated } = useAuth0();

  const [editingStudyProgramme, setEditingStudyProgramme] = useState<StudyProgrammeDataProps>
  ((editing_study_programme)?editing_study_programme:
  {
      description:"",
      language:"Czech",
      name:"",
      studyDegree:"Bachelor",
      subjects:[]
  });

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

  const handleClose = ()=>
  {
    let a = JSON.parse(JSON.stringify(modal))
    a.show = false;
    setModal(a)
  }

  const handleCreateProgramme = async (newProgramme) => {
    setDataLoadStatus("Pending");
    try {
      let allSubjects = []
      //Preparing subjects to be send
      for (let i = 1; i <= 4; i++) {


        for (let s in newProgramme["subjectsYear" + i]) {
          for (let k in subjects) {
            if (subjects[k].id && subjects[k].id === newProgramme["subjectsYear" + i][s].value) {
              allSubjects.push({
                _id: subjects[k].id,
                year: i,
                semester: "winter",
                type: "mandatory"
              })
              newProgramme["subjectsYear" + i][s] = {
                _id: subjects[k].id,
                year: i,
                semester: "winter",
                type: "mandatory"
              }
              console.log(newProgramme["subjectsYear" + i][s])
            }
            
          }
        }
        delete newProgramme["subjectsYear" + i]
      }
      newProgramme.subjects = allSubjects;
      console.log(`New programme to send to server`, newProgramme);
      const response = await axios.post(`${GetApiUrl()}/study-programme/create`, newProgramme, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        console.log('Programme created successfully:', response.data.result);

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
        console.error('Failed to create programme. Response code is not positive:', response.data.response_code);
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
      console.error('Failed to create programme:', error);
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

  const handleUpdateProgramme = async (newProgramme) => {
    setDataLoadStatus("Pending");
    try {
      let allSubjects = []
      //Preparing subjects to be send
      for (let i = 1; i <= 4; i++) {


        for (let s in newProgramme["subjectsYear" + i]) {
          for (let k in subjects) {
            if (subjects[k].id && subjects[k].id === newProgramme["subjectsYear" + i][s].value) {
              allSubjects.push({
                _id: subjects[k]._id,
                year: i,
                semester: "winter",
                type: "mandatory"
              })
              newProgramme["subjectsYear" + i][s] = {
                _id: subjects[k]._id,
                year: i,
                semester: "winter",
                type: "mandatory"
              }
              console.log(newProgramme["subjectsYear" + i][s])
            }
            
          }
        }
        delete newProgramme["subjectsYear" + i]
      }
      newProgramme.subjects = allSubjects;
      
     

      console.log(`New programme to send to server`, newProgramme);
      let id = newProgramme._id;
      delete newProgramme._id;
      newProgramme.id = id;
      const response = await axios.put(`${GetApiUrl()}/study-programme/update/${newProgramme.id}`, newProgramme, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        console.log('Programme created successfully:', response.data.result);
        toast.success("Study Programme Added Successfuly", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            setDataLoadStatus("Loaded");
          },
        });
      } else {
        console.error('Failed to create programme. Response code is not positive:', response.data.response_code);
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
      console.error('Failed to create programme:', error);
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
  };

  

  return (
    <Modal show={modal.show}>
      {
        (dataLoadStatus === "Pending") ?
          <Loading></Loading>
          : (dataLoadStatus === "Error") ?
            <ErrorComponent message={errorMessage}></ErrorComponent> :
              <StudyProgrammeModal _subjects={subjects} modal_props={{show:modal.show, confirm_handler:()=>{console.log("yo")},type:(editingStudyProgramme._id)?"Update":"Create",
              cancel_handler:()=>{handleClose()} }} ></StudyProgrammeModal>
      }
    </Modal>
  )
};

export default StudyProgrammeModalData;
