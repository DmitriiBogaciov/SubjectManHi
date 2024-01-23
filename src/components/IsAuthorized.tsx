import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const IsAuthorized = ({children}:
    {children:string | JSX.Element | JSX.Element[] | (() => JSX.Element),neededPermissions:Array<String> }) => {

    const { loginWithRedirect, getAccessTokenSilently, isAuthenticated, user } = useAuth0();

    const neededPermissions = [];
    const [permissions, setPermissions] = useState<Array<String>>([]);
    const {t} = useTranslation();
    console.log(children)
    useEffect(() => {
        const handleAuth = async () => {
            try {
                const accessToken = await getAccessTokenSilently();
                const decodedToken = jwtDecode(accessToken);
                // @ts-ignore 
                if (decodedToken.permissions)
                     // @ts-ignore
                    setPermissions(decodedToken.permissions);

            } catch (error) {
                console.error("Error during authentication:", error.message);
            }
        };

        if (isAuthenticated) {
            handleAuth();
        }
    }, [isAuthenticated, user, getAccessTokenSilently]);

    if(!isAuthenticated)
        return(
            <div>
                <p>{t("authenticationNeeded")}</p>
            </div>
            )
    //Checking if all permissions are matched 
    if( neededPermissions.length > 0 && !neededPermissions.every(r=>permissions.includes(r)) )
    return(
        <div>
            <p>{t("notEnoughPermissions")}</p>
        </div>
        )

    return (
        <>
        { children }
        </>
    );
};

export default IsAuthorized;