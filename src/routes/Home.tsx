import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import { useTranslation } from "react-i18next";

import StudyProgrammeGridCardData from "../components/data-component/StudyProgrammeGridCard.datacomponent.tsx";


export default function Home() {

  const {t} = useTranslation();
 

  return (
    <main className="container pt-3">
      <h2 className="p-0 pb-2 mb-4 text-left border-b-2 text-2xl">{t("home.header")}</h2>
      <StudyProgrammeGridCardData ></StudyProgrammeGridCardData>
      <ToastContainer/>
    </main>
  );
}
