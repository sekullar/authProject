import User from "../images/account.svg"
import "../css/userControl.css"
import Modal from 'react-modal';
import { useState } from "react";
import { db } from '../firebase/Firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { ProgressSpinner } from 'primereact/progressspinner';
import toast from "react-hot-toast";
import { useEffect } from "react";
import Close from "../images/close.svg"

const UserControl = () => {

    const [modalOpen,setModalOpen] = useState(false)
    const [loading,setLoading] = useState(false)
    const [userData,setUserData] = useState();
    const [userName,setUsername] = useState("");
    const [userId,setUserId] = useState("");
    const [userMail,setUserMail] = useState("");
    const [userRole,setUserRole] = useState("");

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

      const getUser = async () => {
        try{
            setLoading(true)
            const userTabCollection = collection(db, "users");
            const userSnapshot = await getDocs(userTabCollection);
            const userList = userSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            console.log(userList)
            setUserData(userList)
            setLoading(false)
        }
        catch{
            setLoading(false)
            toast.error("Kullanıcı verileri alınırken bir hata oluştu")
        }
      }

      useEffect(() => {
        getUser();
      }, [])

    return(
        <>  
        <Modal style={customStyles} isOpen={modalOpen}>
            <div className="flex flex-col relative w-[400px]">
                <img src={Close} onClick={() => setModalOpen(false)} className="absolute end-0 top-0 invert w-[35px]" alt="Close" />
                <div className="flex items-center mb-8 mt-5">
                    <img src={User} className="w-[75px] invert" alt="" />
                    <p className="inter-400 text-3xl">{userName}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className={`flex items-center ${userRole === "Seku" ? "bg-sky-500 text-white inter-500 transition-all duration-300 hover:bg-sky-400 rounded-lg p-2" : "isOk"}`}>
                        <p className="inter-400 text-lg">Rol: </p>
                        <p className="inter-400 text-lg">{userRole}</p>
                    </div>
                    <div className="flex items-center">
                        <p className="inter-400 text-lg">Mail adresi: </p>
                        <p className="inter-400 text-lg">{userMail}</p>
                    </div>
                    <div className="flex items-center">
                        <p className="inter-400 text-lg">ID:</p>
                        <p className="inter-400 text-lg">{userId}</p>
                    </div>
                </div>
            </div>
        </Modal>
            <div className="flex items-center justify-center flex-col">
                <p className="inter-500 text-4xl">Üye Kontrolü</p>
                <div className="flex flex-col mt-12  p-2 rounded-lg  gap-4">
                    {loading ? <ProgressSpinner /> : 
                       userData && userData.map((user,key) => {
                            return(
                                <div key={key} className="flex items-center justify-between w-[650px] border-user-control p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <img src={User} className="invert w-[35px]" alt="User" />
                                        <p className="inter-500">{user.username}</p>
                                    </div>
                                    <button className="inter-500 bg-sky-500 hover:bg-sky-600 transition-all duration-300 px-4 py-2 rounded-lg text-white" onClick={() => {setModalOpen(true); setUserId(user.id); setUsername(user.username); setUserMail(user.email); setUserRole(user.role)}}>...</button>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default UserControl