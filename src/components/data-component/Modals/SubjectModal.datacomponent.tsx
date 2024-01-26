import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';

//Custom components
import SubjectModal from '../../VisualComponent/Modals/SubjectModal.component.tsx';
import Loading from '../../VisualComponent/Loading.component.tsx';
import ErrorComponent from '../../VisualComponent/Error.component.tsx';

import { ModalDataProps } from '../../../props/nonVisual/Modal.dataprops.tsx';
import { useAuth0 } from '@auth0/auth0-react';
import { jwtDecode } from 'jwt-decode';

//API URL of server
import GetApiUrl from '../../../assets/helperFunc/GetApiUrl.helper.tsx';
import { useTranslation } from 'react-i18next';
import { SubjectDataProps } from '../../../props/nonVisual/Subject.dataprops.tsx';


//mode = "create" | "update"
const SubjectModalData = ({ modal_props, editing_subject_id }: { modal_props: ModalDataProps, editing_subject_id?: string }) => {

  const [dataLoadStatus, setDataLoadStatus] = useState("Pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [topics, setTopics] = useState([]);
  const [modal, setModal] = useState<ModalDataProps>(modal_props)
  const [editingSubject, setEditingSubject] = useState<SubjectDataProps>
    (
      {
        description: "",
        language: "Czech",
        name: "",
        credits: 0,
        digitalContentIdList: [],
        goal: "",
        students: [],
        supervisor: { _id: "", userName: "" },
        topicIdList: []
    });

  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    //Getting all subjects
    fetch(`${GetApiUrl()}/topic/list`, {
      method: "GET",
    })
      .then(async (response) => {
        const responseJson = await response.json();
        console.log(responseJson.result);
        if (response.status >= 400) {
          toast.success("Success obtaining subjects", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
        } else {
          setDataLoadStatus("Loaded")
          console.log(responseJson.result);
          setTopics(responseJson.result)
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

    console.log(editing_subject_id)
    if(editing_subject_id)
    {
      getSubjectHandler(editing_subject_id).then((value)=>
      {
        console.log(value)
        if(typeof value === "object" && "credits" in value)
        {
          setEditingSubject(
            {
              _id:value._id,
              description:value.description,
              language:value.language,
              name:value.name,
              credits:value.credits,
              digitalContentIdList:[...value.digitalContentIdList],
              topicIdList:[...value.topicIdList],
              students:(value.students)?[...value.students]:[],
              supervisor:value.supervisor,
              goal:value.goal,
            }
          );
        }
        
      })
    }
    else
      setEditingSubject( {
        description: "",
        language: "Czech",
        name: "",
        credits: 0,
        digitalContentIdList: [],
        goal: "",
        students: [],
        supervisor: { _id: "", userName: "" },
        topicIdList: []
    })
    setModal(modal_props);

  }, [editing_subject_id, modal_props])

  const handleClose = () => {
    let a = JSON.parse(JSON.stringify(modal))
    a.show = false;
    setModal(a)
  }

  const getSubjectHandler = async (subjectId?:string) => {
    //setDataLoadStatus("Pending");
    if(!subjectId)
      return;

    try {

      const response = await axios.get(`${GetApiUrl()}/subject/get/${subjectId}`, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });
      console.log(response)
      if (response.data && response.data.response_code === 200) {
        console.log('Programme obtained successfully:', response.data.result);
        return (Array.isArray(response.data.result))?response.data.result[0]:response.data.result;
      } else {
        console.error('Failed to obtain subject. Response code is not positive:', response.data.response_code);
        toast.error("Something went wrong when creating subject", {
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
      console.error('Failed to create subject:', error);
      toast.error("Something went wrong when creating subject", {
        position: "top-center",
        autoClose: 1000,
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

  const createSubjectHandler = async (newSubject) => {
    setDataLoadStatus("Pending");
    try {
      newSubject.credits = parseInt(newSubject.credits); 
      console.log(`New programme to send to server`, newSubject);
      const response = await axios.post(`${GetApiUrl()}/subject/create`, newSubject, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        toast.success("Subject Added Successfuly", {
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
        toast.error("Something went wrong when creating subject", {
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
      toast.error("Something went wrong when creating subject", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        onClose: () => {
          setDataLoadStatus("Loaded");
          handleClose();
        },
      });
    }
  };

  const updateSubjectHandler = async (newSubject) => {
    setDataLoadStatus("Pending");
    try {
      console.log(newSubject)
      const response = await axios.put(`${GetApiUrl()}/subject/update`, newSubject, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        setDataLoadStatus("Loaded");
        console.log('Programme created successfully:', response.data.result);
        toast.success("Subject Updated Successfuly", {
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
        console.error('Failed to update subject. Response code is not positive:', response.data.response_code);
        setDataLoadStatus("Loaded");
        toast.error("Something went wrong when updating subject", {
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
      toast.error("Something went wrong when updating subject", {
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
            <SubjectModal _topics={topics} editing_subject={editingSubject} modal_props={{
              show: modal.show, confirm_handler: (val) => { (val && val._id) ? updateSubjectHandler(val) : createSubjectHandler(val); }, type: (editingSubject._id) ? "Update" : "Create",
              cancel_handler: () => { handleClose() }
            }} ></SubjectModal>
      }
    </Modal>
  )
};

export default SubjectModalData;
