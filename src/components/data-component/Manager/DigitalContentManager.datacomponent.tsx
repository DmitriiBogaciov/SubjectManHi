import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

//Custom components
import Loading from "../../VisualComponent/Loading.component.tsx";
import Error from "../../VisualComponent/Error.component.tsx";
import DigitalContentManager from "../../VisualComponent/Manager/DigitalContentManager.component.tsx";

//API URL of server
import GetApiUrl from "../../../assets/helperFunc/GetApiUrl.helper.tsx";

//~~~Props~~~
import { LoadingStatus } from "../../../props/nonVisual/LoadingStatus.data.tsx";
import { DigitalContentDataProps } from "../../../props/nonVisual/DigitalContent.dataprops.tsx";


const DigitalContentManagerData = () => {

    const [allDigitalContents, setAllDigitalContents] = useState<Array<DigitalContentDataProps>>([]);
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
        getAllDigitalContentsHandler();
    }, []);

    const getAllDigitalContentsHandler = async () => {
        try {
            setLoadingStatus("Pending")
            let response = await axios.get(`${GetApiUrl()}/digital-content/list`)

            if (response && response.data && response.data.response_code === 200) {
                setAllDigitalContents(response.data.result)
                setLoadingStatus("Loaded");
            } else {

                setLoadingStatus("Error");
                toast.error("Something went wrong when obtaining digitalContents", {
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
            toast.error("Something went wrong when obtaining digitalContent", {
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

    const deleteDigitalContentHandler = async (deletingDigitalContent:DigitalContentDataProps) => {
        try {
            console.log("Deleting!")
            console.log(deletingDigitalContent);
            setLoadingStatus("Pending")
            if(!deletingDigitalContent._id)
                return false;
            let response = await axios.delete(`${GetApiUrl()}/digital-content/delete/${deletingDigitalContent._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${await getAccessTokenSilently()}`
                    }
                })

            console.log(response.data)
            if (response && response.data && response.data.response_code === 200) {
                await getAllDigitalContentsHandler();
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
                        <DigitalContentManager  edit_digitalContent_handler={(val)=>{console.log("editing"); return false;}} delete_digitalContent_handler={(digitalContent)=>{let a = false; deleteDigitalContentHandler(digitalContent).then((val)=>{a=val}); return a;}} all_digitalContents={allDigitalContents} permissions_={permissions}></DigitalContentManager>

            }

        </>

    )
}

export default DigitalContentManagerData;
