import AccountImg from "../images/account.svg"
import "../css/account.css"
import { DataContext } from './MainContext';
import { useContext, useState } from "react";
import Modal from 'react-modal';
import "../css/main.css"
import CloseImg from "../images/close.svg"
import { useCookies } from "react-cookie";
import toast ,{ Toaster } from "react-hot-toast"


const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      borderRadius:"12px"
    },
  };

const Account = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['uid']);


    const signOut = () => {
        toast.loading("Çıkış yapılıyor...")
        setTimeout(() => {
            removeCookie("uid");
            window.location.reload();
            toast.dismiss();
        }, [500])
        
    }

    const [modalIsOpen,SetModalIsOpen] = useState(false)

    const { userInfoName,userInfoRole,emailContext,photoUrl,phoneNumber,userId,emailVerified } = useContext(DataContext);

    return(
        <>
            <Modal isOpen={modalIsOpen}   style={customStyles} contentLabel="Example Modal">
                <div className="flex flex-col">
                    <div className="header flex justify-between items-center">
                        <p className="text-xl inter-500">Çıkış</p>
                        <img src={CloseImg} className="invert w-[45px] cursor-pointer" onClick={() => SetModalIsOpen(false)} alt="Close" />
                    </div>
                    <div className="p-[1px] bg-gray-200 my-2"></div>
                    <div className="my-5"> 
                        <p className="inter-400 text-xl"><span className="inter-600 ">Çıkış yapmak </span> istediğine emin misin?</p>
                    </div>
                    <div className="flex justify-end">
                        <a href="#" onClick={() => signOut()} className="text-lg mt-5 inter-500 bg-red-500 rounded-lg transition-all duration-300 hover:bg-red-600 text-white p-1 px-4">Çıkış yap</a>
                    </div>
                </div>
            </Modal>
            <div className="flex flex-col h-full relative">
                <div className="flex justify-start items-center gap-4">
                    <div className="border-profile-black rounded-lg">   
                        <img src={AccountImg} className="invert w-[150px] h-[150px]" alt="Account" />
                    </div>
                    <div className="flex flex-col">
                        <p className="text-2xl inter-400">Kullanıcı adı: {userInfoName}</p>
                        <p className="text-2xl inter-400">Rol Statüsü: {userInfoRole}</p>
                    </div>
                </div>
                <div className="flex flex-col gap-3 mt-5">
                    <p className="inter-400 text-xl">E-Posta: <span className="inter-600">{emailContext || "E-Posta tanımlanmamış"}</span></p>
                    <p className="inter-400 text-xl">Fotoğraf URL: <span className="inter-600">{photoUrl || "Profil Fotoğrafı yok"}</span></p>
                    <p className="inter-400 text-xl">Telefon Numarası: <span className="inter-600">{phoneNumber || "Telefon Numarası eklenmedi"}</span></p>
                    <p className="inter-400 text-xl">User ID: <span className="inter-600">{userId || "User ID tanımlanmamış. Bu bir hata olabilir."}</span></p>
                    <p className="inter-400 text-xl">E-Posta doğrulaması: <span className="inter-600">{emailVerified ? "Doğrulandı" : "Doğrulanmadı"}</span></p>
                </div>
                <a href="#" onClick={() => SetModalIsOpen(true)} className="absolute bottom-0 text-lg inter-500 bg-red-500 rounded-lg transition-all duration-300 hover:bg-red-600 text-white p-2 px-8">Çıkış yap</a>
            </div>
        </>
    )
}

export default Account