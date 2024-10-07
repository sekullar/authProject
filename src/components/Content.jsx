import "../css/main.css"
import { ProgressSpinner } from 'primereact/progressspinner';
import { db } from '../firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { DataContext } from "./MainContext"
import { useContext } from "react"
import "../css/content.css"
import { useCookies } from "react-cookie";
import Account from "./Account";
import SSS from "../components/SSS"
import Home from "../components/Home"
import MemberTabsControl from "./MemberTabsControl";
import ToDoList from "./ToDoList";


const Content = () => {



    const { userInfoName, setUserInfoName } = useContext(DataContext)
    const { userInfoRole, setUserInfoRole } = useContext(DataContext)
    const { contentValue } = useContext(DataContext)

    const [cookies, setCookie, removeCookie] = useCookies(['uid']);


    const [homeShow, setHomeShow] = useState(true)
    const [sssShow,setSssShow] = useState(false);
    const [userSettingsShow,setUserSettingsShow] = useState(false);
    const [memberTabsControl,setMemberTabsControl] = useState(false);
    const [TodoApp, setTodoApp] = useState(false)



    const [loadingState, setLoadingState] = useState(true);

    const getUserInfos = async () => {
        setLoadingState(true)
        const userInfoCollection = collection(db, "users");
        const userSnapShot = await getDocs(userInfoCollection);
        const userList = userSnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("userList",userList)
        const foundUser = userList.find(user => user.id === cookies.uid);
        console.log("userSnapShot",userSnapShot)  
        if (foundUser) {
            setUserInfoName(foundUser.username);  
            setUserInfoRole(foundUser.role);  
        }
        setLoadingState(false)
    }

    useEffect(() => {
        if(contentValue == "home"){
            setHomeShow(true)
            setSssShow(false)
            setUserSettingsShow(false)
            setTodoApp(false)
            setMemberTabsControl(false)
        }
        if (contentValue == "Kişisel Sorular"){
            setSssShow(true)
            setHomeShow(false)
            setUserSettingsShow(false)
            setTodoApp(false)
            setMemberTabsControl(false)
        }
        if(contentValue == "userSettings"){
            setUserSettingsShow(true)
            setSssShow(false)
            setMemberTabsControl(false)
            setHomeShow(false)
            setTodoApp(false)
        }
        if(contentValue == `"Member" sekmelerini yönet`){
            setMemberTabsControl(true)
            setUserSettingsShow(false)
            setSssShow(false)
            setHomeShow(false)
            setTodoApp(false)
        }
        if(contentValue == "ToDo List App"){
            setTodoApp(true)
            setMemberTabsControl(false)
            setUserSettingsShow(false)
            setSssShow(false)
            setHomeShow(false)
        }
    }, [contentValue])

    useEffect(() => {
        getUserInfos()
    }, [])

    return (
        <>
            {loadingState ? 
            <div className="bg-white p-8 rounded-lg h-full w-full mb-4 me-2">
                <ProgressSpinner />
            </div>
             : 
                <div className="bg-white p-8 rounded-lg  h-full w-full mb-4 me-2">
                    {sssShow ?  <div className="flex flex-col">
                        <p className="text-center text-5xl inter-600">SSS</p>
                        <p className="text-center text-xl inter-400 mt-3">Kişisel Sorular</p>
                        <SSS userInfoRole={userInfoRole}/>
                    </div> : ""}
                    {homeShow ?  <div className="flex flex-col gap-5">
                        <Home userInfoName={userInfoName} userInfoRole={userInfoRole}/>
                    </div> : ""}
                    {userSettingsShow ? <Account/> : ""}
                    {memberTabsControl ? <MemberTabsControl /> : ""}
                    {TodoApp ? <ToDoList /> : ""}
                </div>
            }
        </>
    )
}

export default Content