import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';

//Custom components
import DigitalContentModal from '../../VisualComponent/Modals/DigitalContentModal.component.tsx';
import Loading from '../../VisualComponent/Loading.component.tsx';
import ErrorComponent from '../../VisualComponent/Error.component.tsx';

import { ModalDataProps } from '../../../props/nonVisual/Modal.dataprops.tsx';
import { useAuth0 } from '@auth0/auth0-react';
import { jwtDecode } from 'jwt-decode';

//API URL of server
import GetApiUrl from '../../../assets/helperFunc/GetApiUrl.helper.tsx';
import { useTranslation } from 'react-i18next';
import { DigitalContentDataProps } from '../../../props/nonVisual/DigitalContent.dataprops.tsx';


//mode = "create" | "update"
const DigitalContentModalData = ({ modal_props, editing_digitalContent_id }: { modal_props: ModalDataProps, editing_digitalContent_id?: string }) => {

  const [dataLoadStatus, setDataLoadStatus] = useState("Pending");
  const [errorMessage, setErrorMessage] = useState("");
  const [digitalContents, setDigitalContents] = useState([]);
  const [modal, setModal] = useState<ModalDataProps>(modal_props)
  const [editingDigitalContent, setEditingDigitalContent] = useState<DigitalContentDataProps>
    (
      {
        description: "",
        name: "",
        externalLink: ""
      });

  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    getAllDigitalContetsHandler();
  }, [])

  useEffect(() => {

    console.log(editing_digitalContent_id)
    if (editing_digitalContent_id) {
      getDigitalContentHandler(editing_digitalContent_id).then((value) => {
        console.log(value)
        if (typeof value === "object" && "externalLink" in value) {
          setEditingDigitalContent(
            {
              _id: value._id,
              description: value.description,
              name: value.name,
              externalLink: value.externalLink
            }
          );
        }

      })
    }
    else
      setEditingDigitalContent({
        description: "",
        name: "",
        externalLink: ""
      })
    setModal(modal_props);

  }, [editing_digitalContent_id, modal_props])

  const handleClose = () => {
    let a = JSON.parse(JSON.stringify(modal))
    a.show = false;
    setModal(a)
  }

  const getAllDigitalContetsHandler = async () => {
    //Getting all digital contents
    axios.get(`${GetApiUrl()}/digital-content/list`, {
      method: "GET",
    })
      .then(async (response) => {
        const responseJson = response.data;
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
  };

  const getDigitalContentHandler = async (digitalContentId?: string) => {
    //setDataLoadStatus("Pending");
    if (!digitalContentId)
      return;

    try {

      const response = await axios.get(`${GetApiUrl()}/digital-content/get/${digitalContentId}`, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });
      console.log(response)
      if (response.data && response.data.response_code === 200) {
        console.log('Programme obtained successfully:', response.data.result);
        return (Array.isArray(response.data.result)) ? response.data.result[0] : response.data.result;
      } else {
        console.error('Failed to obtain digitalContent. Response code is not positive:', response.data.response_code);
        toast.error("Something went wrong when creating digitalContent", {
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
      console.error('Failed to create digitalContent:', error);
      toast.error("Something went wrong when creating digitalContent", {
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

  const createDigitalContentHandler = async (newDigitalContent) => {
    setDataLoadStatus("Pending");
    try {
      console.log(`New programme to send to server`, newDigitalContent);
      const response = await axios.post(`${GetApiUrl()}/digital-content/create`, newDigitalContent, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        toast.success("DigitalContent Added Successfuly", {
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
        toast.error("Something went wrong when creating digitalContent", {
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
      toast.error("Something went wrong when creating digitalContent", {
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

  const updateDigitalContentHandler = async (newDigitalContent) => {
    setDataLoadStatus("Pending");
    try {
      console.log(newDigitalContent)
      const response = await axios.put(`${GetApiUrl()}/digital-content/update`, newDigitalContent, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {
        setDataLoadStatus("Loaded");
        console.log('Programme created successfully:', response.data.result);
        toast.success("DigitalContent Updated Successfuly", {
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
        console.error('Failed to update digitalContent. Response code is not positive:', response.data.response_code);
        setDataLoadStatus("Loaded");
        toast.error("Something went wrong when updating digitalContent", {
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
      toast.error("Something went wrong when updating digitalContent", {
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
        <Modal.Title>{t("digitalContent.modal.title")}</Modal.Title>
      </Modal.Header>
      {
        (dataLoadStatus === "Pending") ?
          <Loading></Loading>
          : (dataLoadStatus === "Error") ?
            <ErrorComponent message={errorMessage}></ErrorComponent> :
            <DigitalContentModal editing_digitalContent={editingDigitalContent} modal_props={{
              show: modal.show, confirm_handler: (val) => { (val && val._id) ? updateDigitalContentHandler(val) : createDigitalContentHandler(val); }, type: (editingDigitalContent._id) ? "Update" : "Create",
              cancel_handler: () => { handleClose() }
            }} ></DigitalContentModal>
      }
    </Modal>
  )
};

export default DigitalContentModalData;
