import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

//Custom components
import Loading from "../../VisualComponent/Loading.component.tsx";
import Error from "../../VisualComponent/Error.component.tsx";
import SubjectManager from "../../VisualComponent/Manager/SubjectManager.component.tsx";
//API URL of server
import GetApiUrl from "../../../assets/helperFunc/GetApiUrl.helper.tsx";

//~~~Props~~~
import { LoadingStatus } from "../../../props/nonVisual/LoadingStatus.data.tsx";
import { SubjectDataProps } from "../../../props/nonVisual/Subject.dataprops.tsx";


const SubjectManagerData = () => {

    const [allSubjects, setAllSubjects] = useState<Array<SubjectDataProps>>([]);
    const [LoadingStatus, setLoadingStatus] = useState<LoadingStatus>("Loaded");

    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

    const [permissions, setPermissions] = useState<Array<string>>([]);

    const { t } = useTranslation();
    useEffect(() => {
        const handleAuth = async () => {
            try {
                const accessToken = await getAccessTokenSilently();

                const userProfile = await user;
                const userId = user?.sub;

                const decodedToken = jwtDecode(accessToken);
                console.log(accessToken)
                //@ts-ignore
                if (decodedToken.permissions)
                    //@ts-ignore
                    setPermissions(decodedToken.permissions);

            } catch (error) {
                console.error("Error during authentication:", error.message);
            }
        };

        if (isAuthenticated) {
            handleAuth();
        }
    }, [isAuthenticated, user, getAccessTokenSilently]);

    useEffect(() => {
        const getAllSubjects = async () => {
            try {
                setLoadingStatus("Pending")
                let response = await axios.get(`${GetApiUrl()}/subject/list`)

                if (response && response.data && response.data.response_code === 200) {
                    setAllSubjects(response.data.result)
                    setLoadingStatus("Loaded");
                } else {

                    setLoadingStatus("Error");
                    toast.error("Something went wrong when obtaining subjects", {
                        position: "top-center",
                        autoClose: 1500,
                        hideProgressBar: false,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                        theme: "dark",
                        onClose: () => {
                            setLoadingStatus("Loaded");
                        },
                    });
                }
            } catch (error) {
                setLoadingStatus("Error");
                toast.error("Something went wrong when obtaining subjects", {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    onClose: () => {

                    },
                });
            }
        }
        getAllSubjects();
    }, []);


    const deleteSubjectHandler = async (deletingSubject:SubjectDataProps) => {
        try {
            console.log("Deleting!")
            console.log(deletingSubject);
            setLoadingStatus("Pending")
            if(!deletingSubject._id)
                return false;
            let response = await axios.delete(`${GetApiUrl()}/subject/delete/${deletingSubject._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${await getAccessTokenSilently()}`
                    }
                })

            console.log(response.data)
            if (response && response.data && response.data.response_code === 200) {
                setLoadingStatus("Loaded");
                toast.success(t("deleted.success"), {
                    position: "top-center",
                    autoClose: 750,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    onClose: () => {
                        setLoadingStatus("Loaded");
                    },
                });
                return true;
            } else {
                toast.error(t("deleted.error"), {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    onClose: () => {
                        setLoadingStatus("Loaded");
                    },
                });
            }
        } catch (error) {
            toast.error(t("deleted.error"), {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                onClose: () => {
                    setLoadingStatus("Loaded");
                },
            });
        }
        return false;
    }

    return (

        <>
            {
                (LoadingStatus === "Pending") ?
                    <Loading></Loading>
                    : (LoadingStatus === "Error") ?
                        <Error message={""}></Error> :
                        <SubjectManager edit_subject_handler={()=>{return true}} permissions_={permissions} all_subjects={allSubjects} delete_subject_handler={(subject)=>{let a = false; deleteSubjectHandler(subject).then((val)=>{a=val}); return a;}} ></SubjectManager>

            }

        </>

    )
}

export default SubjectManagerData;
