import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';

//Custom components
import TopicModal from '../../VisualComponent/Modals/TopicModal.component.tsx';
import Loading from '../../VisualComponent/Loading.component.tsx';
import ErrorComponent from '../../VisualComponent/Error.component.tsx';

import { ModalDataProps } from '../../../props/nonVisual/Modal.dataprops.tsx';
import { useAuth0 } from '@auth0/auth0-react';
import { jwtDecode } from 'jwt-decode';

//API URL of server
import GetApiUrl from '../../../assets/helperFunc/GetApiUrl.helper.tsx';
import { useTranslation } from 'react-i18next';
import { TopicDataProps } from '../../../props/nonVisual/Topic.dataprops.tsx';


//mode = "create" | "update"
const TopicModalData = ({ modal_props, editing_topic_id }: { modal_props: ModalDataProps, editing_topic_id?: string }) => {

  const [dataLoadStatus, setDataLoadStatus] = useState("Pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [digitalContents, setDigitalContents] = useState([]);
  const [modal, setModal] = useState<ModalDataProps>(modal_props)
  const [editingTopic, setEditingTopic] = useState<TopicDataProps>
    (
      {
        description: "",
        name: "",
        digitalContentIdList: []
    });

  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    //Getting all digital contents
    fetch(`${GetApiUrl()}/digital-content/list`, {
      method: "GET",
    })
      .then(async (response) => {
        const responseJson = await response.json();
        console.log(responseJson.result);
        if (response.status >= 400) {
          toast.success("Success obtaining digital content", {
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
          setDigitalContents(responseJson.result)
        }
      })
      .catch((error) => {
        setDataLoadStatus("Error")
        toast.error("Error obtaining digitalContents", {
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

    console.log(editing_topic_id)
    if(editing_topic_id)
    {
      getTopicHandler(editing_topic_id).then((value)=>
      {
        console.log(value)
        if(typeof value === "object" && "digitalContentIdList" in value)
        {
          setEditingTopic(
            {
              _id:value._id,
              description:value.description,
              name:value.name,
              digitalContentIdList:[...value.digitalContentIdList]
            }
          );
        }
        
      })
    }
    else
      setEditingTopic( {
        description: "",
        name: "",
        digitalContentIdList: []
    })
    setModal(modal_props);

  }, [editing_topic_id, modal_props])

  const handleClose = () => {
    let a = JSON.parse(JSON.stringify(modal))
    a.show = false;
    setModal(a)
  }

  const getTopicHandler = async (topicId?:string) => {
    //setDataLoadStatus("Pending");
    if(!topicId)
      return;

    try {

      const response = await axios.get(`${GetApiUrl()}/topic/get/${topicId}`, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });
      console.log(response)
      if (response.data && response.data.response_code === 200) {
        console.log('Programme obtained successfully:', response.data.result);
        return (Array.isArray(response.data.result))?response.data.result[0]:response.data.result;
      } else {
        console.error('Failed to obtain topic. Response code is not positive:', response.data.response_code);
        toast.error("Something went wrong when creating topic", {
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
      console.error('Failed to create topic:', error);
      toast.error("Something went wrong when creating topic", {
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

  const createTopicHandler = async (newTopic) => {
    setDataLoadStatus("Pending");
    try {
      console.log(`New programme to send to server`, newTopic);
      const response = await axios.post(`${GetApiUrl()}/topic/create`, newTopic, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        toast.success("Topic Added Successfuly", {
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
        toast.error("Something went wrong when creating topic", {
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
      toast.error("Something went wrong when creating topic", {
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

  const updateTopicHandler = async (newTopic) => {
    setDataLoadStatus("Pending");
    try {
      console.log(newTopic)
      const response = await axios.put(`${GetApiUrl()}/topic/update`, newTopic, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        setDataLoadStatus("Loaded");
        console.log('Programme created successfully:', response.data.result);
        toast.success("Topic Updated Successfuly", {
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
        console.error('Failed to update topic. Response code is not positive:', response.data.response_code);
        setDataLoadStatus("Loaded");
        toast.error("Something went wrong when updating topic", {
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
      toast.error("Something went wrong when updating topic", {
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
        <Modal.Title>{t("topic.modal.title")}</Modal.Title>
      </Modal.Header>
      {
        (dataLoadStatus === "Pending") ?
          <Loading></Loading>
          : (dataLoadStatus === "Error") ?
            <ErrorComponent message={errorMessage}></ErrorComponent> :
            <TopicModal _digitalContents={digitalContents} editing_topic={editingTopic} modal_props={{
              show: modal.show, confirm_handler: (val) => { (val && val._id) ? updateTopicHandler(val) : createTopicHandler(val); }, type: (editingTopic._id) ? "Update" : "Create",
              cancel_handler: () => { handleClose() }
            }} ></TopicModal>
      }
    </Modal>
  )
};

export default TopicModalData;
