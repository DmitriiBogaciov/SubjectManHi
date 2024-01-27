import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const IsAuthorized = ({children,neededPermissions,printNoAuthorization}:
    {children:string | JSX.Element | JSX.Element[] | (() => JSX.Element),neededPermissions:Array<string>,printNoAuthorization?:boolean }) => {

    const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

    const [permissions, setPermissions] = useState<Array<string>>([]);
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

    if(!isAuthenticated )
        return(
            (printNoAuthorization===true)?
            <div>
                <p>{t("authenticationNeeded")}</p>
            </div>
            :null
            )
    //Checking if all permissions are matched 
    if( neededPermissions.length > 0 && !neededPermissions.every(r=>permissions.includes(r)) )
    return(
        (printNoAuthorization===true)?
        <div>
            <p>{t("notEnoughPermissions")}</p>
        </div>
        :null
        )

    return (
        <>
        { children }
        </>
    );
};

export default IsAuthorized;