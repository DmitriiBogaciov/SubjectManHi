import React, { useEffect, useState } from "react";
import SubjectDetailData from "../components/data-component/SubjectDetail.datacomponent.tsx";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";


export default function SubjectDetail() {

    const { t } = useTranslation();

    //URL parameters
    const { state } = useLocation();
    console.log(state)
    return (
        <main className="container">
            {
                (state.id)?
                  <SubjectDetailData subject_id={state.id}></SubjectDetailData>
                  :null
            }
        </main>
    );
}
