import React, { useEffect, useState } from "react"

//Components
import { Dropdown, DropdownButton } from "react-bootstrap";

//Custom components
import Button from "./Button.component.tsx"
import IsAuthorized from "../IsAuthorized.tsx";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { GetRolePermissions } from "../../assets/helperFunc/GetRolePermissions.helper.tsx";

const AdminNavBar = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();

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