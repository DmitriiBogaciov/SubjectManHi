import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

//Custom components
import Loading from "../../VisualComponent/Loading.component.tsx";
import Error from "../../VisualComponent/Error.component.tsx";
import TopicManager from "../../VisualComponent/Manager/TopicManager.component.tsx";

//API URL of server
import GetApiUrl from "../../../assets/helperFunc/GetApiUrl.helper.tsx";

//~~~Props~~~
import { LoadingStatus } from "../../../props/nonVisual/LoadingStatus.data.tsx";
import { TopicDataProps } from "../../../props/nonVisual/Topic.dataprops.tsx";


const TopicManagerData = () => {

    const [allTopics, setAllTopics] = useState<Array<TopicDataProps>>([]);
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
        getAllTopicsHandler();
    }, []);

    const getAllTopicsHandler = async () => {
        try {
            setLoadingStatus("Pending")
            let response = await axios.get(`${GetApiUrl()}/topic/list`)

            if (response && response.data && response.data.response_code === 200) {
                setAllTopics(response.data.result)
                setLoadingStatus("Loaded");
            } else {

                setLoadingStatus("Error");
                toast.error("Something went wrong when obtaining topics", {
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
            toast.error("Something went wrong when obtaining topic", {
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

    const deleteTopicHandler = async (deletingTopic:TopicDataProps) => {
        try {
            console.log("Deleting!")
            console.log(deletingTopic);
            setLoadingStatus("Pending")
            if(!deletingTopic._id)
                return false;
            let response = await axios.delete(`${GetApiUrl()}/topic/delete/${deletingTopic._id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${await getAccessTokenSilently()}`
                    }
                })

            console.log(response.data)
            if (response && response.data && response.data.response_code === 200) {
                await getAllTopicsHandler();
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
                        <TopicManager  edit_topic_handler={(val)=>{console.log("editing"); return false;}} delete_topic_handler={(topic)=>{let a = false; deleteTopicHandler(topic).then((val)=>{a=val}); return a;}} all_topics={allTopics} permissions_={permissions}></TopicManager>

            }

        </>

    )
}

export default TopicManagerData;
