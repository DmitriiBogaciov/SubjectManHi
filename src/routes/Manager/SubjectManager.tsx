import React from "react";
import { ToastContainer } from "react-toastify";

//Custom components
import SubjectManagerData from "../../components/data-component/Manager/SubjectManager.datacomponent.tsx";
import IsAuthorized from "../../components/IsAuthorized.tsx";


export default function SubjectManager() {

  return (
    <IsAuthorized neededPermissions={["admin:admin"]} printNoAuthorization={true}>
      <main className="container pt-3">
        <SubjectManagerData />
        <ToastContainer />
      </main>
    </IsAuthorized>
  );
}
