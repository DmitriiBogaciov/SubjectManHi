import React, { useEffect, useState } from "react"
import Button from "./Button.component.tsx"

import { useTranslation } from "react-i18next";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AdminNavBar = () => {

    const { loginWithRedirect, getAccessTokenSilently, isAuthenticated, user } = useAuth0();

    const [permissions, setPermissions] = useState<Array<String>>([]);

    const { t } = useTranslation();
    const navigate  = useNavigate();
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

    if (!isAuthenticated || !permissions.includes("admin:admin"))
    {
        return null;
    }
    else
        return (
            <div className="bg-slate-600 text-white flex">
                <div className="p-2">
                    <Button label={t("manage.studyProgramme.title")} type="Default" onClickHandler={() => navigate("/manage/studyProgramme")}></Button>
                </div>
                <div className="p-2">
                    <Button label={t("manage.subject.title")} type="Default" onClickHandler={() => navigate("/manage/subject")}></Button>
                </div>
                <div className="p-2">
                    <Button label={t("manage.topic.title")} type="Default" onClickHandler={() => navigate("/manage/topic")}></Button>
                </div>
                <div className="p-2">
                    <Button label={t("manage.digitalContent.title")} type="Default" onClickHandler={() => navigate("/manage/digitalContent")}></Button>
                </div>
            </div>
        )
}

export default AdminNavBar