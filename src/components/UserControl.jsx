import User from "../images/account.svg"
import "../css/userControl.css"
import Modal from 'react-modal';
import { useState } from "react";
import { db } from '../firebase/Firebase';
import { collection, getDocs, doc, updateDoc, connectFirestoreEmulator } from 'firebase/firestore';
import { ProgressSpinner } from 'primereact/progressspinner';
import toast from "react-hot-toast";
import { useEffect } from "react";
import Close from "../images/close.svg"
import Ban from "../images/mdi--ban.svg"

const UserControl = () => {

    const [modalOpen,setModalOpen] = useState(false)
    const [loading,setLoading] = useState(false)
    const [userData,setUserData] = useState([]);
    const [userName,setUsername] = useState("");
    const [userId,setUserId] = useState("");
    const [userMail,setUserMail] = useState("");
    const [userRole,setUserRole] = useState("");
    const [userRoleControl, setUserRoleControl] = useState("");
    const [isBanned,setIsBanned] = useState(false);
    const [banLoading,setBanLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState(""); 

    const [newRole, setNewRole] = useState("");
    const [effectedUıd,setEffectedUıd] = useState("")

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

      const changeRole = async () => {
        try {
           const userDocRef = doc(db,"users",effectedUıd)
           await updateDoc(userDocRef, {
            role: newRole
           });
           toast.success("Rol başarıyla değiştirildi")
           setModalOpen(false)
           getUser();

        } catch (error) {
            toast.error("Rol değiştirilirken hata oluştu")
        }
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
            setUserData(userList)
            setLoading(false)
        }
        catch{
            setLoading(false)
            toast.error("Kullanıcı verileri alınırken bir hata oluştu")
        }
      }

      const clearInput = () => {
        setNewRole("")
      }

      const banUser =  async () => {
        try{
            setBanLoading(true)
            const banRef = doc(db,"users",effectedUıd);
            await updateDoc(banRef, {
                banned: true
            })
            toast.success("Kullanıcı yasaklandı")
            setModalOpen(false)
            setBanLoading(false)
            getUser();
        }
        catch{
            setBanLoading(false)
            toast.error("Kullanıcı yasaklanırken bir hata oluştu")
        }
      }

      const unBanUser =  async () => {
        try{
            setBanLoading(true)
            const banRef = doc(db,"users",effectedUıd);
            await updateDoc(banRef, {
                banned: false
            })
            toast.success("Kullanıcı yasağı kaldırıldı")
            setModalOpen(false)
            setBanLoading(false)
            getUser();
        }
        catch{
            setBanLoading(false)
            toast.error("Kullanıcı yasağı kaldırılırken bir hata oluştu")
        }
      }

      useEffect(() => {
        getUser();
      }, [])

      const filteredUsers = userData.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return(
        <>  
        <Modal style={customStyles} isOpen={modalOpen}>
            <div className="flex flex-col relative w-[400px]">
                <img src={Close} onClick={() => {setModalOpen(false);}} className="absolute end-0 top-0 invert w-[35px]" alt="Close" />
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
                <div className="flex flex-col mt-12">
                    {userRoleControl === "Seku" ? <div>
                        <p className="opacity-60 inter-700">Bu kullanıcın rolü değiştirelemez</p>
                    </div>:
                        <div className="flex flex-col">
                            <p className="inter-600 text-lg">Kullanıcı rolünü değiştir</p>
                            <input type="text" className="border rounded-md mb-2 outline-0 my-2 px-2" value={newRole} onChange={(e) => setNewRole(e.target.value)} id="userControlsInput"/>
                            <button className="bg-sky-500 hover:bg-sky-600 transition-all duration-300 text-white inter-400 py-1 rounded-lg" onClick={() => {changeRole(); clearInput();}} >Değiştir</button>
                        </div>
                    }
                    <div className="flex flex-col mt-6">
                        {userRoleControl === "Seku" ? 
                        <div>
                            <button className="bg-red-300 text-white p-2 rounded-lg inter-600">
                                Bu kullanıcı yasaklanamaz
                            </button>   
                        </div> 
                        :
                        <div>
                            {isBanned === true ? 
                                banLoading ? 
                                <div className="flex justify-center">
                                    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                                </div>
                                 :
                                <button className="flex items-center bg-green-500 text-white gap-2 rounded-lg inter-500 p-2" onClick={() => unBanUser()}>
                                    Kullanıcının Yasağını Kaldır <img src={Ban} className="w-[25px]" alt="Ban" />
                                </button> : ""
                            }
                            {!isBanned || isBanned === "false" ? 
                             banLoading ? 
                             <div className="flex justify-center">
                                <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                            </div> 
                            :
                            <button className="flex items-center bg-red-500 text-white gap-2 rounded-lg inter-500 p-2" onClick={() => banUser()}>
                                Kullanıcıyı Yasakla <img src={Ban} className="w-[25px]" alt="Ban" />
                            </button> : ""}
                            
                        </div>
                        }
                    </div>
                </div>
            </div>
        </Modal>
            <div className="flex items-center justify-center flex-col">
                <p className="inter-500 text-4xl">Üye Kontrolü</p>
                <div className="flex flex-col mt-12 p-2 rounded-lg gap-4 ">
                <input 
                    type="text" 
                    placeholder="Kullanıcı ara..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="border rounded-md my-4 p-2 w-[650px]"
                />
                <div className="h-[520px] overflow-auto flex flex-col gap-4">
                {loading ? <ProgressSpinner /> :
                        filteredUsers && filteredUsers.map((user, key) => {
                            return (
                                <div key={key} className="flex items-center justify-between w-[650px] border-user-control p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <img src={User} className="invert w-[35px]" alt="User" />
                                        <p className="inter-500">{user.username}</p>
                                    </div>
                                    <button className="inter-500 bg-sky-500 hover:bg-sky-600 transition-all outline-0 duration-300 px-4 py-2 rounded-lg text-white" onClick={() => {
                                        setModalOpen(true);
                                        setUserId(user.id);
                                        setUsername(user.username);
                                        setUserMail(user.email);
                                        setUserRole(user.role);
                                        setUserRoleControl(user.role);
                                        setEffectedUıd(user.id);
                                        clearInput();
                                        setIsBanned(user.banned);
                                    }}>...</button>
                                </div>
                            );
                        })
                    }
                </div>
                </div>
            </div>
        </>
    )
}

export default UserControl