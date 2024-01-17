import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

import CreateProgrammeModal from '../visual-component/create-programme-modal';
import Loading from '../visual-component/Loading';
import ErrorComponent from '../visual-component/Error.component';
import { toast } from 'react-toastify';
const CreateProgrammeModalData = ({ show, handleClose, handleCreateProgramme }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    language: '',
    degree: '',
  });

  const [dataLoadStatus, setDataLoadStatus] = useState("Loaded");
  const [errorMessage,setErrorMessage] = useState("");


  const handle_create_programme = async (new_programme) =>
  {
    setDataLoadStatus("Pending");
     await handleCreateProgramme(new_programme).then((response)=>
    {
      if(response === true)
      {

        setDataLoadStatus("Loaded");
        toast.success("Study Programme Added Successfuly", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: ()=>
          {
            handleClose();
          },
        });
      }
      else
      {
        setDataLoadStatus("Error");
        toast.error("Something went wrong when creating study programme", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          onClose: ()=>
          {
            handleClose();
          },
        });
      }

    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
    {
      (dataLoadStatus === "Pending")?
      <Loading></Loading>
      :(dataLoadStatus === "Error")?
      <ErrorComponent message={errorMessage}></ErrorComponent>:
     
        <CreateProgrammeModal handleClose={handleClose} handleCreateProgramme={handle_create_programme} show={show}></CreateProgrammeModal>
   
      
    
    }
    </Modal>
  )
};

export default CreateProgrammeModalData;
