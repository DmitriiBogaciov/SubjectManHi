import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { toast } from 'react-toastify';


//Custom components...
import Loading from "../VisualComponent/Loading.component.tsx";
import Error from "../VisualComponent/Error.component.tsx";


//API URL of server
import GetApiUrl from "../../assets/helperFunc/GetApiUrl.helper.tsx";

//Props
import { LoadingStatus } from "../../props/nonVisual/LoadingStatus.data.tsx";
import { CardProps } from "../../props/Card.props.tsx";
import { useNavigate } from "react-router";
import { TopicDataProps } from "../../props/nonVisual/Topic.dataprops.tsx";
import { DigitalContentDataProps } from "../../props/nonVisual/DigitalContent.dataprops.tsx";
import ToggleList from "../VisualComponent/ToggleList.component.tsx";
import { ListItemProps } from "../../props/ListItem.props.tsx";
import DigitalContentModal from "../VisualComponent/Modals/DigitalContentModal.component.tsx";
import { Modal } from "react-bootstrap";



//For obtaining additional information for topic (e.g. all digital contents)
const TopicCardData = ({ card_props, _topic }: { card_props: CardProps, _topic: TopicDataProps }) => {

    const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>("Pending");
    const [cardProps, setCardProps] = useState<CardProps>(card_props)
    const [allTopicDigitalContent, setAllTopicDigitalContent] = useState<Array<DigitalContentDataProps>>([]);
    const [topic, setTopic] = useState<TopicDataProps>(_topic)
    const [listItems, setListItems] = useState<Array<ListItemProps>>([])
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [shownDigitalContent, setShownDigitalContent] = useState<DigitalContentDataProps>();

    useEffect(() => {
        setTopic(_topic);
        getAllDigitalContentFromTopic(_topic).then((val) => {
            setListItemsFromDigitalContent();
        });
        setCardProps(card_props);
    }, [card_props, _topic]);

    const getAllDigitalContentFromTopic = async (topic: TopicDataProps) => {

        if (!topic._id)
            return;

        let allDigitalContents = await getAllDigitalContent();
        if (allDigitalContents) {
            setAllTopicDigitalContent(new Array());
            //Getting only relevant topics
            allDigitalContents.map((digitalContent) => {
                for (let d in topic.digitalContentIdList) {
                    if (topic.digitalContentIdList[d] === digitalContent._id)
                        allTopicDigitalContent.push(digitalContent)
                }
            });
        }
        setLoadingStatus("Loaded")
    }

    const getAllDigitalContent = async () => {
        try {
            let response = await axios.get(`${GetApiUrl()}/digital-content/list`)

            if (response && response.data && response.data.response_code === 200) {

                let digitalContent = response.data.result;
                return digitalContent;
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
        return null;
    }

    const setListItemsFromDigitalContent = () => {
        allTopicDigitalContent.map((digitalContent) => {
            listItems.push({ label: digitalContent.name, value: digitalContent, onClick: (val) => { console.log(val); setShownDigitalContent(val) } })
        });
    };

    return (

        <div className="">
            {
                (loadingStatus === "Pending") ?
                    <Loading></Loading>
                    : (loadingStatus === "Error") ?
                        <Error message={""}></Error>
                        :
                        <div className="bg-slate-100 p-4 shadow-md">
                            <div className="p-2 mb-2 border-b-2 border-slate-700">
                                <h3 className="text-lg text-left">{topic.name}</h3>
                            </div>
                            <div>
                                <div className="text-left">

                                </div>
                                <ToggleList title={t("digitalContent.list")} is_open={false} list_items={listItems}></ToggleList>
                            </div>
                        </div>

            }

            <Modal show={shownDigitalContent!== undefined}>
                <DigitalContentModal modal_props={{ type: "View",cancel_handler:()=>{setShownDigitalContent(undefined)} }} editing_digitalContent={shownDigitalContent}></DigitalContentModal>
            </Modal>
        </div>

    )
}

export default TopicCardData;
