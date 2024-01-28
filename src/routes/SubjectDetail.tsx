import React, { useEffect, useState } from "react";
import SubjectDetailData from "../components/data-component/SubjectDetail.datacomponent.tsx";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import IsAuthorized from "../components/IsAuthorized.tsx";


export default function SubjectDetail() {

    const { t } = useTranslation();

    //URL parameters
    const { state } = useLocation();
    console.log(state)
    return (
        <IsAuthorized neededPermissions={[]} printNoAuthorization={true}>
            <main className="container ">
                {
                    (state.id)?
                    <SubjectDetailData subject_id={state.id}></SubjectDetailData>
                    :null
                }
            </main>
        </IsAuthorized>
    );
}
