import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';

import StudyProgrammeModal from '../visual-component/programme-modal';
import Loading from '../visual-component/Loading';
import ErrorComponent from '../visual-component/Error.component';
import axios from "axios";
import { toast } from 'react-toastify';

const apiUrl = process.env.REACT_APP_API_URL;

//mode = "create" | "update"
const ProgrammeModalData = ({ show, handleClose, token, mode, studyProgramme  }) => {

  const [dataLoadStatus, setDataLoadStatus] = useState("Loaded");
  const [errorMessage, setErrorMessage] = useState("");
  const [subjects, setSubjects] = useState([]);


  useEffect(() => {
    //Getting all subjects
    fetch(`${apiUrl}/subject/list`, {
      method: "GET",
    })
      .then(async (response) => {
        const responseJson = await response.json();
        console.log(responseJson.result);
        if (response.status >= 400) {
          setDataLoadStatus("Error")
          setErrorMessage("Error getting subjects")
        } else {
          setDataLoadStatus("Loaded")
          console.log(responseJson.result);
          setSubjects(responseJson.result)
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
  }, [])


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
      const response = await axios.post(`${apiUrl}/study-programme/create`, newProgramme, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        console.log('Programme created successfully:', response.data.result);
        setDataLoadStatus("Loaded");
        toast.success("Study Programme Added Successfuly", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            handleClose();
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
      let id = newProgramme._id;
      delete newProgramme._id;
      newProgramme.id = id;
      const response = await axios.put(`${apiUrl}/study-programme/update/${newProgramme.id}`, newProgramme, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        console.log('Programme created successfully:', response.data.result);
        setDataLoadStatus("Loaded");
        toast.success("Study Programme Added Successfuly", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: () => {
            handleClose();
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
          setDataLoadStatus("Loaded");
        },
      });
    }
  };

  
 /* const handleDeleteProgramme = async (deletedProgramme) => {
    try {
      setDataLoadStatus("Pending")
      console.log(`Programme id to delete`, deletedProgramme);
      const response = await axios.delete(`${apiUrl}/study-programme/delete/${deletedProgramme}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        console.log('Programme deleted successfully:', response.data.result);
        toast.success("Something went wrong when creating study programme", {
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
        window.location.reload();
      } else {
        console.error('Failed to delete programme. Response code is not positive:', response.data.response_code);
      }
    } catch (error) {
    console.error('Failed to delete programme:', error);
    }
  }*/

  return (
    <Modal show={show} onHide={handleClose}>
      {
        (dataLoadStatus === "Pending") ?
          <Loading></Loading>
          : (dataLoadStatus === "Error") ?
            <ErrorComponent message={errorMessage}></ErrorComponent> :

            <StudyProgrammeModal handleClose={handleClose} handleCreateProgramme={handleCreateProgramme} 
            show={show} subjects={subjects} handleUpdateProgramme={handleUpdateProgramme}  mode={mode} studyProgramme={studyProgramme} ></StudyProgrammeModal>

      }
    </Modal>
  )
};

export default ProgrammeModalData;
