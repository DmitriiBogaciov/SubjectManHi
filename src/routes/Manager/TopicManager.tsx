import React from "react";
import { ToastContainer } from "react-toastify";

//Custom components
import TopicManagerData from "../../components/data-component/Manager/TopicManager.datacomponent.tsx";
import IsAuthorized from "../../components/IsAuthorized.tsx";
import { GetRolePermissions } from "../../assets/helperFunc/GetRolePermissions.helper.tsx";



export default function TopicManager() {
  

  return (
    <IsAuthorized neededPermissions={GetRolePermissions("Teacher")} printNoAuthorization={true}>
      <main className="container pt-3">
        <TopicManagerData />
        <ToastContainer />
      </main>
    </IsAuthorized>
  );
}
