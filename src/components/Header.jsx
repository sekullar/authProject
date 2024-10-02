import "../css/main.css"
import AccountImg from "../images/account.svg"
import SettingsImg from "../images/mdi--settings.svg"
import { DataContext } from "../components/MainContext"
import { useContext, useState, useEffect } from "react"
import { ProgressSpinner } from 'primereact/progressspinner';

const Header = ()  => {
    const { userInfoName } = useContext(DataContext);
    const [loadingState, setLoadingState] = useState(true);
    const { contentValue,setContentValue } = useContext(DataContext);


    useEffect(() => {
        if (userInfoName) {
            setLoadingState(false);
        } else {
            setLoadingState(true);
        }
    }, [userInfoName]);

    return (
        <>
            <div className="header bg-white rounded-lg p-5 mx-2 my-2 mb-1">
                {loadingState ? (
                    <ProgressSpinner />
                ) : (
                    <div className="flex justify-between items-center">
                        <p className="inter-400 text-xl">Hoşgeldin, {userInfoName}</p>
                        <div className="flex items-center gap-3">
                            <img src={AccountImg} onClick={() => setContentValue("userSettings")} className="invert w-[35px] cursor-pointer" alt="Account" />
                            <img src={SettingsImg} className="invert w-[35px] cursor-pointer" alt="Settings" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
    }
export default Header
