import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

//Custom components
import Loading from "../../VisualComponent/Loading.component.tsx";
import Error from "../../VisualComponent/Error.component.tsx";
import StudyProgrammeManager from "../../VisualComponent/Manager/StudyProgrammeManager.component.tsx";

//API URL of server
import GetApiUrl from "../../../assets/helperFunc/GetApiUrl.helper.tsx";

//~~~Props~~~
import { LoadingStatus } from "../../../props/nonVisual/LoadingStatus.data.tsx";
import { StudyProgrammeDataProps } from "../../../props/nonVisual/StudyProgramme.dataprops.tsx";


const StudyProgrammeManagerData = () => {

    const [allStudyProgrammes, setAllStudyProgrammes] = useState<Array<StudyProgrammeDataProps>>([]);
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
                if(decodedToken.permissions)
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
        const getAllStudyProgrammes = async () => {
            try {
                setLoadingStatus("Pending")
                let response = await axios.get(`${GetApiUrl()}/study-programme/list`)

                if (response && response.data && response.data.response_code === 200) {
                    setAllStudyProgrammes(response.data.result)
                    setLoadingStatus("Loaded");
                } else {

                    setLoadingStatus("Error");
                    toast.error("Something went wrong when obtaining study programmes", {
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
                toast.error("Something went wrong when obtaining study programme", {
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
        getAllStudyProgrammes();
    }, []);

    const getAllStudyProgrammes = async () => {
        try {
            setLoadingStatus("Pending")
            let response = await axios.get(`${GetApiUrl()}/study-programme/list`)

            if (response && response.data && response.data.response_code === 200) {
                setAllStudyProgrammes(response.data.result)
                setLoadingStatus("Loaded");
            } else {

                setLoadingStatus("Error");
                toast.error("Something went wrong when obtaining study programmes", {
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
            toast.error("Something went wrong when obtaining study programme", {
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


    return (

        <>
            {
                (LoadingStatus === "Pending") ?
                    <Loading></Loading>
                    : (LoadingStatus === "Error") ?
                        <Error message={""}></Error> :
                        <StudyProgrammeManager all_study_programmes={allStudyProgrammes} permissions_={permissions}></StudyProgrammeManager>

            }

        </>

    )
}

export default StudyProgrammeManagerData;
