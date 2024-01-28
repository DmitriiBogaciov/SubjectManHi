import React, { useEffect, useState } from "react"

//Components
import { Dropdown, DropdownButton } from "react-bootstrap";

//Custom components
import Button from "./Button.component.tsx"
import IsAuthorized from "../IsAuthorized.tsx";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GetRoleByPermissions, GetRolePermissions } from "../../assets/helperFunc/GetRolePermissions.helper.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";
import { UserDataProps } from "../../props/nonVisual/User.dataprops.tsx";

const AdminNavBar = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

    
    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

    const [userInfo, setUserInfo] = useState<UserDataProps>({_permissions:[]});

    useEffect(() => {
        const handleAuth = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const decodedToken = jwtDecode(accessToken);
                // @ts-ignore 
                if (decodedToken.permissions)
                     // @ts-ignore
                    setUserInfo({_user:user,_token:accessToken,_permissions:decodedToken.permissions})
            } catch (error) {
                console.error("Error during authentication:", error.message);
            }
        };

        if (isAuthenticated) {
            handleAuth();
        }
    }, [isAuthenticated, user, getAccessTokenSilently]);

    const viewPermissions = () =>
    {
        return (userInfo._permissions && userInfo._permissions?.includes("admin:admin"))?userInfo._permissions:GetRolePermissions("Teacher")
    };
    return (
        <IsAuthorized neededPermissions={GetRolePermissions("Teacher")}>
            <div className="bg-slate-600 text-white hidden md:flex">
                <IsAuthorized neededPermissions={GetRolePermissions("Admin")}>
                    <div className="p-2">
                        <Button label={t("manage.studyProgramme.title")} type="Default" on_click_handler={() => navigate("/manage/studyProgramme")}></Button>
                    </div>
                </IsAuthorized>
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
            <div className="flex md:hidden mb-2 bg-slate-600">
                <DropdownButton title={t("admin.dropdown")} className="p-2">
                    <IsAuthorized neededPermissions={GetRolePermissions("Admin")}>
                        <div className="p-2">
                            <Button label={t("manage.studyProgramme.title")} type="Default" on_click_handler={() => navigate("/manage/studyProgramme")}></Button>
                        </div>
                    </IsAuthorized>
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
        </IsAuthorized>
    )
}

export default AdminNavBar