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
import QuickSiteComp from "./QuickSite";
import QuickSiteAdminComp from "./QuickSiteAdmin";
import UserControl from "./UserControl";


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
    const [QuickSite, setQuickSite] = useState(false)
    const [QuickSiteAdmin, setQuickSiteAdmin] = useState(false)
    const [userControlState,setUserControlState] = useState(false);




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
        const componentsVisibility = {
            home: false,
            KişiselSorular: false,
            userSettings: false,
            memberTabsControl: false,
            todoApp: false,
            quickSite: false,
            quickSiteAdmin: false,
            userControl: false
        };
    
        // contentValue değerine göre ilgili bileşeni göster
        switch (contentValue) {
            case "home":
                componentsVisibility.home = true;
                break;
            case "Kişisel Sorular":
                componentsVisibility.KişiselSorular = true;
                break;
            case "userSettings":
                componentsVisibility.userSettings = true;
                break;
            case `"Member" sekmelerini yönet`:
                componentsVisibility.memberTabsControl = true;
                break;
            case "ToDo List App":
                componentsVisibility.todoApp = true;
                break;
            case "Quick Site":
                componentsVisibility.quickSite = true;
                break;
            case "Quick Site Admin":
                componentsVisibility.quickSiteAdmin = true;
                break;
            case "Üye Kontrolü":
                componentsVisibility.userControl = true;
                break;
            default:
                break;
        }
    
        // Bileşenlerin görünürlük durumunu ayarlamak için set fonksiyonlarını çağır
        setHomeShow(componentsVisibility.home);
        setSssShow(componentsVisibility.KişiselSorular);
        setUserSettingsShow(componentsVisibility.userSettings);
        setMemberTabsControl(componentsVisibility.memberTabsControl);
        setTodoApp(componentsVisibility.todoApp);
        setQuickSite(componentsVisibility.quickSite);
        setQuickSiteAdmin(componentsVisibility.quickSiteAdmin);
        setUserControlState(componentsVisibility.userControl)
    }, [contentValue]);
    

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
                    {QuickSite ? <QuickSiteComp /> : ""}
                    {QuickSiteAdmin ? <QuickSiteAdminComp /> : ""}
                    {userControlState ? <UserControl /> : ""}
                </div>
            }
        </>
    )
}

export default Content