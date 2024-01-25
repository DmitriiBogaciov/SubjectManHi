import React, { useEffect, useState } from "react"

import Button from "./Button.component.tsx"
import { Dropdown, DropdownButton } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AdminNavBar = () => {

    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

    const [permissions, setPermissions] = useState<Array<string>>([]);

    const { t } = useTranslation();
    const navigate = useNavigate();
    useEffect(() => {
        const handleAuth = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const decodedToken = jwtDecode(accessToken);
                // @ts-ignore 
                if (decodedToken.permissions)
                    // @ts-ignore
                    setPermissions(decodedToken.permissions);

            } catch (error) {
                console.error("Error during authentication:", error.message);
            }
        };

        if (isAuthenticated) {
            handleAuth();
        }
    }, [isAuthenticated, user, getAccessTokenSilently]);

    if (!isAuthenticated || !permissions.includes("admin:admin")) {
        return null;
    }
    else
        return (
            <>
                <div className="bg-slate-600 text-white hidden md:flex">
                    <div className="p-2">
                        <Button label={t("manage.studyProgramme.title")} type="Default" on_click_handler={() => navigate("/manage/studyProgramme")}></Button>
                    </div>
                    <div className="p-2">
                        <Button label={t("manage.subject.title")} type="Default" on_click_handler={() => navigate("/manage/subject")}></Button>
                    </div>
                    <div className="p-2">
                        <Button label={t("manage.topic.title")} type="Default" on_click_handler={() => navigate("/manage/topic")}></Button>
                    </div>
                    <div className="p-2">
                        <Button label={t("manage.digitalContent.title")} type="Default" on_click_handler={() => navigate("/manage/digitalContent")}></Button>
                    </div>
                </div>
                <div className="flex md:hidden">
                    <DropdownButton title={"yo"} className={"bg-black"}>
                        <div className="p-2">
                            <Button label={t("manage.studyProgramme.title")} type="Default" on_click_handler={() => navigate("/manage/studyProgramme")}></Button>
                        </div>
                        <div className="p-2">
                            <Button label={t("manage.subject.title")} type="Default" on_click_handler={() => navigate("/manage/subject")}></Button>
                        </div>
                        <div className="p-2">
                            <Button label={t("manage.topic.title")} type="Default" on_click_handler={() => navigate("/manage/topic")}></Button>
                        </div>
                        <div className="p-2">
                            <Button label={t("manage.digitalContent.title")} type="Default" on_click_handler={() => navigate("/manage/digitalContent")}></Button>
                        </div>
                    </DropdownButton>
                </div >
            </>
        )
}

export default AdminNavBar