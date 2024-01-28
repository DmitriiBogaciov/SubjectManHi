import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

//Custom components
import StudyProgrammeManagerData from "../../components/data-component/Manager/StudyProgrammeManager.datacomponent.tsx";
import IsAuthorized from "../../components/IsAuthorized.tsx";


//Props
import { GetRolePermissions } from "../../assets/helperFunc/GetRolePermissions.helper.tsx";

export default function StudyProgrammeManager() {
 

  return (
    <IsAuthorized neededPermissions={GetRolePermissions("Admin")} printNoAuthorization={true}>
      <main className="container pt-3 md:p-0">
        <StudyProgrammeManagerData />
        <ToastContainer />
      </main>
    </IsAuthorized>
  );
}
