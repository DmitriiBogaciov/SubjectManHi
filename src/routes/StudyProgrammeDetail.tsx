import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";

import SubjectGridCardData from "../components/data-component/SubjectGridCard.datacomponent.tsx";

export default function StudyProgrammeDetail() {

    const { t } = useTranslation();

    //URL parameters
    const { state } = useLocation();
    console.log(state)
    return (
        <main className="container pt-3">
            <h2 className="p-0 pb-2 mb-4 text-left border-b-2 text-2xl">{t("studyProgramme.detail.header")}</h2>
            {
                (state.id)?
                  <SubjectGridCardData study_programme_id={state.id}></SubjectGridCardData>
                  :null
            }
        </main>
    );
}
