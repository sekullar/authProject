import "../css/main.css"
import BanGif from  "../images/bane-no.gif"
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom"



const Banned = () => {

    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['uid']);

    if(!cookies.uid){
        navigate("/login")
    }

    return(
        <>
            <div className="w-screen h-screen flex items-center bg-white flex-col gap-2 justify-center">
                <p className="text-5xl inter-600">Erişim engellendi!</p>
                <p className="text-4xl inter-600">Siteden kalıcı olarak yasaklandınız</p>
                <img src={BanGif} className="mt-12" alt="BanGif" />
            </div>
        </>
    )
}

export default Banned