import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

//Custom components
import StudyProgrammeManagerData from "../../components/data-component/Manager/StudyProgrammeManager.datacomponent.tsx";
import IsAuthorized from "../../components/IsAuthorized.tsx";


//Props
import { StudyProgrammeDataProps } from "../../props/nonVisual/StudyProgramme.dataprops.tsx";

export default function StudyProgrammeManager() {
 

  return (
    <IsAuthorized neededPermissions={["admin:admin"]} printNoAuthorization={true}>
      <main className="container pt-3">
        <StudyProgrammeManagerData />
        <ToastContainer />
      </main>
    </IsAuthorized>
  );
}
