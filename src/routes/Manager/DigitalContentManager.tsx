import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

//Custom components
import DigitalContentManagerData from "../../components/data-component/Manager/DigitalContentManager.datacomponent.tsx";

import { useAuth0 } from "@auth0/auth0-react";
import IsAuthorized from "../../components/IsAuthorized.tsx";


export default function DigitalContentManager() {
 
  return (
    <IsAuthorized neededPermissions={["admin:admin"]} printNoAuthorization={true}>
      <main className="container pt-3">
        <DigitalContentManagerData />
        <ToastContainer />
      </main>
    </IsAuthorized>
  );
}
