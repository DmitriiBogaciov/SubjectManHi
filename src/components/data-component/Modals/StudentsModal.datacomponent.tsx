import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import axios from "axios";
import { toast } from 'react-toastify';

//Custom components
import Loading from '../../VisualComponent/Loading.component.tsx';
import ErrorComponent from '../../VisualComponent/Error.component.tsx';
import StudentsModal from '../../VisualComponent/Modals/StudentsModal.component .tsx';

import { ModalDataProps } from '../../../props/nonVisual/Modal.dataprops.tsx';
import { useAuth0 } from '@auth0/auth0-react';
import { jwtDecode } from 'jwt-decode';

//API URL of server
import GetApiUrl from '../../../assets/helperFunc/GetApiUrl.helper.tsx';
import { useTranslation } from 'react-i18next';
import { SubjectDataProps } from '../../../props/nonVisual/Subject.dataprops.tsx';


//mode = "create" | "update"
const StudentsModalData = ({ modal_props, _subject }: { modal_props: ModalDataProps, _subject: SubjectDataProps }) => {

  const [dataLoadStatus, setDataLoadStatus] = useState("Loaded");

  const [modal, setModal] = useState<ModalDataProps>(modal_props)
  const [subject, setSubject] = useState<SubjectDataProps>(_subject);

  const { getAccessTokenSilently } = useAuth0();
  const { t } = useTranslation();

  useEffect(() => {
    setSubject(_subject)
  }, [_subject])

  useEffect(() => {
    setModal({...modal_props})
  }, [modal_props])

  const handleClose = () => {
    let a = JSON.parse(JSON.stringify(modal))
    a.show = false;
    setModal(a)
  }

  const updateStudentHandler = async (newStudents:Array<{_id:string,userName:string}>) => {
    setDataLoadStatus("Pending");
    try {
      subject.students = newStudents;
      const response = await axios.put(`${GetApiUrl()}/subject/update`, subject, {
        headers: {
          'Authorization': `Bearer ${await getAccessTokenSilently()}`
        }
      });

      if (response.data && response.data.response_code === 200) {

        setDataLoadStatus("Loaded");
        toast.success("Student Updated Successfuly", {
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
        return true;
      } else {
        console.error('Failed to update student. Response code is not positive:', response.data.response_code);
        setDataLoadStatus("Loaded");
        toast.error("Something went wrong when updating student", {
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
      toast.error("Something went wrong when updating student", {
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
    return false;
  };



  return (
    <Modal show={modal.show} >
      <Modal.Header>
        <Modal.Title>{t("student.modal.title")}</Modal.Title>
      </Modal.Header>
      {
        (dataLoadStatus === "Pending") ?
          <Loading></Loading>
          : (dataLoadStatus === "Error") ?
            <ErrorComponent message={""}></ErrorComponent> :
            <StudentsModal update_students_handler={(newSubject)=>{let a = false; updateStudentHandler(newSubject).then((val)=>a=val); return a; }} _subject={subject} modal_props={{...modal,cancel_handler(value) {
                handleClose();
            },}}></StudentsModal>
      }
    </Modal>
  )
};

export default StudentsModalData;
