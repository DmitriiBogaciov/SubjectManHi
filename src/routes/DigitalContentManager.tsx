import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useTranslation } from "react-i18next";

//Custom components
import DigitalContentManagerData from "../components/data-component/Manager/DigitalContentManager.datacomponent.tsx";

import { useAuth0 } from "@auth0/auth0-react";
import "../css/home.css";


export default function DigitalContentManager() {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [permissions, setPermissions] = useState([]);

  const {t} = useTranslation();
  useEffect(() => {
    const handleAuth = async () => {
      try {
        const accessToken = await getAccessTokenSilently();

        const userProfile = await user;
        const userId = user?.sub;
        console.log(userProfile);
        console.log(userId);

        const decodedToken = jwtDecode(accessToken);
        console.log(decodedToken);

        //This should be correct. Our decoded token contains permission object
        if(decodedToken.permissions)
          setPermissions(decodedToken.permissions);
        //setToken(accessToken);
      } catch (error) {
        console.error("Error during authentication:", error.message);
      }
    };

    if (isAuthenticated) {
      handleAuth();
    }
  }, [isAuthenticated, user, getAccessTokenSilently]);


  return (
    <main className="container pt-3">
      <DigitalContentManagerData />
      <ToastContainer/>
    </main>
  );
}
