import React, { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const DataContext = createContext();

const DataProvider = ({ children }) => {

    const [userInfoName, setUserInfoName] = useState(null)
    const [userInfoRole, setUserInfoRole] = useState(null)
    const [contentValue, setContentValue] = useState(null)
    const [photoUrl, setPhotoUrl] = useState(null)
    const [emailContext, setEmailContext] = useState(null)
    const [phoneNumber, setPhoneNumber] = useState(null)
    const [userId, setUserId] = useState(null)
    const [emailVerified, setEmailVerified] = useState(null)




    const [cookies, setCookie, removeCookie] = useCookies(['uid']);

    useEffect(() => {
        setUserInfoName("");
        setUserInfoRole("");
        setContentValue("home")
    }, [cookies.uid])
    
    return(
        <DataContext.Provider value={{ userInfoName,userInfoRole, contentValue, photoUrl, emailContext, phoneNumber, userId, emailVerified,  setUserInfoName, setUserInfoRole, setContentValue, setPhotoUrl, setEmailContext, setPhoneNumber, setUserId, setEmailVerified }}>
            {children}
        </DataContext.Provider>
    ) 
}

export { DataProvider , DataContext }



