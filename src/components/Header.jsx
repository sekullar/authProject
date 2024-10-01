import "../css/main.css"
import AccountImg from "../images/account.svg"
import SettingsImg from "../images/mdi--settings.svg"

const Header = ()  => {
    return(
        <>
             <div className="header bg-white rounded-lg p-5 mx-2 my-2 mb-1">
                <div className="flex justify-between items-center">
                    <p className="inter-400 text-xl">Hoşgeldin, Seku!</p>
                    <div className="flex items-center gap-3">
                        <img src={AccountImg} className="invert w-[35px] cursor-pointer" alt="Account" />
                        <img src={SettingsImg} className="invert w-[35px] cursor-pointer" alt="Account" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Header