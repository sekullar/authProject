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
    const [banCheck,setBanCheck] = useState(null)
    const [darkMode,setDarkMode] = useState(null)




    const [cookies, setCookie, removeCookie] = useCookies(['uid']);

    useEffect(() => {
        setCookie("darkModeCookies", darkMode, { path: "/", expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) });
    }, [darkMode]); 
    

    useEffect(() => {
        setDarkMode(cookies.darkModeCookies || false); 
    }, []);
    

    useEffect(() => {
        setUserInfoName("");
        setUserInfoRole("");
        setContentValue("home")
    }, [cookies.uid])
    
    return(
        <DataContext.Provider value={{ userInfoName,userInfoRole, contentValue, photoUrl, emailContext, phoneNumber, userId, emailVerified, banCheck, darkMode,  setUserInfoName, setUserInfoRole, setContentValue, setPhotoUrl, setEmailContext, setPhoneNumber, setUserId, setEmailVerified, setBanCheck,setDarkMode }}>
            {children}
        </DataContext.Provider>
    ) 
}

export { DataProvider , DataContext }



