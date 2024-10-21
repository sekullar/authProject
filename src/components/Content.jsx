import "../css/main.css"
import { ProgressSpinner } from 'primereact/progressspinner';
import { db } from '../firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from "react";
import { DataContext } from "./MainContext"
import { useContext } from "react"
import "../css/content.css"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";
import Account from "./Account";
import SSS from "../components/SSS"
import Home from "../components/Home"
import MemberTabsControl from "./MemberTabsControl";
import ToDoList from "./ToDoList";
import QuickSiteComp from "./QuickSite";
import QuickSiteAdminComp from "./QuickSiteAdmin";
import UserControl from "./UserControl";
import Annoncunment from "./Annoncunments";
import Settings from "./Settings";
import Chat from "./Chat";
import ValorantInfo from "./ValorantInfo";
import SteamInfo from "./SteamInfo";


const Content = () => {



    const { userInfoName, setUserInfoName } = useContext(DataContext)
    const { userInfoRole, setUserInfoRole } = useContext(DataContext)
    const { banCheck, setBanCheck } = useContext(DataContext)
    const { darkMode } = useContext(DataContext)
    const { contentValue } = useContext(DataContext)
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['uid']);


    const [homeShow, setHomeShow] = useState(true)
    const [sssShow,setSssShow] = useState(false);
    const [userSettingsShow,setUserSettingsShow] = useState(false);
    const [memberTabsControl,setMemberTabsControl] = useState(false);
    const [TodoApp, setTodoApp] = useState(false)
    const [QuickSite, setQuickSite] = useState(false)
    const [QuickSiteAdmin, setQuickSiteAdmin] = useState(false)
    const [userControlState,setUserControlState] = useState(false);
    const [annoncunment,setAnnoncunment] = useState(false);
    const [settings,setSettings] = useState(false);
    const [chatState,setChatState] = useState(false);
    const [valorantInfoComp,setValorantInfoComp] = useState(false);
    const [steamInfoComp,setSteamInfoComp] = useState(false);








    const [loadingState, setLoadingState] = useState(true);

    const getUserInfos = async () => {
        setLoadingState(true)
        const userInfoCollection = collection(db, "users");
        const userSnapShot = await getDocs(userInfoCollection);
        const userList = userSnapShot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const foundUser = userList.find(user => user.id === cookies.uid);
        if (foundUser) {
            setUserInfoName(foundUser.username);  
            setUserInfoRole(foundUser.role);  
            setBanCheck(foundUser.banned)
            if(banCheck === true){
                if(cookies.uid){
                    navigate("/banned")
                }
                else{
                    navigate("/login")
                }
            }
        }
        setLoadingState(false)
    }

    useEffect(() => {
        if(banCheck === true){
            navigate("/banned")
        }
    }, [banCheck])

    useEffect(() => {
        console.log(chatState)
    }, [chatState])


    useEffect(() => {
        const componentsVisibility = {
            home: false,
            KişiselSorular: false,
            userSettings: false,
            memberTabsControl: false,
            todoApp: false,
            quickSite: false,
            quickSiteAdmin: false,
            userControl: false,
            annoncunment: false,
            addAnnoncunment: false,
            settings: false,
            chat: false,
            valorantInfo: false,
            steamInfo: false
        };
    
        switch (contentValue) {
            case "home":
                componentsVisibility.home = true;
                break;
            case "Kişisel Sorular":
                componentsVisibility.KisiselSorular = true;
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
            case "Duyurular":
                componentsVisibility.annoncunment = true;
            break;
            case "Duyuru Ekle":
                componentsVisibility.addAnnoncunment = true;
            break;
            case "Ayarlar":
                componentsVisibility.settings = true;
            break;
            case "Sohbetler":
                componentsVisibility.chat = true;
            break;
            case "Valorant Info":
                componentsVisibility.valorantInfo = true;
            break;
            case "Steam Info":
                componentsVisibility.steamInfo = true;
            break;
            default:
                break;
        }
    
        setHomeShow(componentsVisibility.home);
        setSssShow(componentsVisibility.KisiselSorular);
        setUserSettingsShow(componentsVisibility.userSettings);
        setMemberTabsControl(componentsVisibility.memberTabsControl);
        setTodoApp(componentsVisibility.todoApp);
        setQuickSite(componentsVisibility.quickSite);
        setQuickSiteAdmin(componentsVisibility.quickSiteAdmin);
        setUserControlState(componentsVisibility.userControl);
        setAnnoncunment(componentsVisibility.annoncunment);
        setSettings(componentsVisibility.settings);
        setChatState(componentsVisibility.chat);
        setValorantInfoComp(componentsVisibility.valorantInfo);
        setSteamInfoComp(componentsVisibility.steamInfo)
    }, [contentValue]);
    
    useEffect(() => {
        console.log(contentValue)
    }, [contentValue])

    useEffect(() => {
        getUserInfos()
    }, [])

    useEffect(() => {
        if(!cookies.uid){
            navigate("/login")
            setBanCheck(false)
        }
    }, [])

    
    

    return (
        <>
            {loadingState ? 
            <div className={`${darkMode ? "darkMode text-white" : "bg-white text-black"} p-8 rounded-lg h-full w-full mb-4 me-2`}>
                <ProgressSpinner />
            </div>
             : 
                <div className={`${darkMode ? "darkMode text-white" : "bg-white text-black"} p-8 rounded-lg calc-max-w h-full w-full mb-4 me-2`}>
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
                    {annoncunment ? <Annoncunment /> : ""}
                    {settings ? <Settings /> : ""}
                    {chatState ? <Chat /> : ""}
                    {valorantInfoComp ? <ValorantInfo /> : ""}
                    {steamInfoComp ? <SteamInfo /> : ""}
                </div>
            }
        </>
    )
}

export default Content