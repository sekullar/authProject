import { ref, onValue, push, set, remove} from "firebase/database";
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, onSnapshot} from 'firebase/firestore';
import { rtdb } from "../firebase/Firebase";  
import Send from "../images/mynaui--send.svg";
import { useCookies } from "react-cookie";
import { db } from '../firebase/Firebase';
import toast from 'react-hot-toast';
import { useContext, useEffect, useState, useRef } from "react";
import { DataContext } from "./MainContext";
import { ProgressSpinner } from 'primereact/progressspinner';
import Modal from 'react-modal';
import Close from "../images/close.svg";
import "../css/chat.css";
import User from "../images/account.svg";
import Switch, { SwitchProps } from '@mui/material/Switch';


const Chat = () => {
    const [cookies] = useCookies(['uid']);
    const [systemSenderCookie, setCookies] = useCookies(['systemSenderInfo']);
    const { userInfoRole, userInfoName,darkMode } = useContext(DataContext);
    const [messageContent, setMessageContent] = useState("");
    const [messageInside, setMessageInside] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const endOfMessagesRef = useRef(null); 

    const [isOkError, setIsOkError] = useState(false);
    const [isOkControlState, setIsOkControlState] = useState([]);
    const [systemMode,setSystemMode]  = useState(false);
    const [systemSenderInfo,setSystemSenderInfo] = useState(true);

    const getMessages = () => {
        try {
            const messagesRef = ref(rtdb, "liveChat", cookies.uid);
            onValue(messagesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const messagesList = Object.entries(data).map(([key, value]) => ({
                        id: key,  
                        ...value  
                    }));
                    console.log(messagesList);
                    setMessageInside(messagesList);
                } else {
                    console.log("Veri bulunamadı");
                    setMessageInside([]);
                }
            });
        } catch (error) {
            console.error("Duyuru mesajları çekilirken bir hata oluştu:", error);
        }
    };

    const addMessage = async () => {
        try {
            setMessageContent("");  
            const usersRef = ref(rtdb, 'liveChat');
            setLoading(true);  
            const newMessageRef = push(usersRef);

            await set(newMessageRef, {
                name: userInfoName,
                message: messageContent,
                timestamp: Date.now(), 
            });
            setLoading(false); 
        } catch (error) {
            toast.error("Mesaj gönderilirken bir hata oluştu");  
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addMessage();
        }
    };

    useEffect(() => {
        if (messageInside.length > 0) {
            endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
        }
        getIsOkForChat();
    }, [messageInside]);

    useEffect(() => {
        getMessages();
        console.log(isOkControlState)
    }, []);


    const autoMessageForIsOkFromAdmin = async () => {
        try {
            setMessageContent("");  
            const usersRef = ref(rtdb, 'liveChat');
            setLoading(true);  
            const newMessageRef = push(usersRef);
    
            await set(newMessageRef, {
                name: "Sistem",
                message: systemSenderCookie.systemSenderInfo 
                    ? `${userInfoName}, sohbet ayarlarında değişiklik yaptı.` 
                    : "Bir yetkili, sohbet ayarlarında değişiklik yaptı.",
                timestamp: Date.now(), 
            });
            setLoading(false); 
        } catch (error) {
            toast.error("Mesaj gönderilirken bir hata oluştu");  
            setLoading(false);
        }
    }
    

    const clearLiveChat = async () => {
        try {
            const chatRef = ref(rtdb, "liveChat"); 
            await remove(chatRef); 
            console.log("Tüm sohbet verileri silindi.");
            toast.success("Sohbet verileri başarıyla silindi."); 
        } catch (error) {
            console.error("Silme işlemi sırasında hata oluştu:", error);
            toast.error("Sohbet verileri silinirken hata oluştu.");
        }
    };

    const updateIsOkFor = async () => {
        try {
            const docRef = doc(db, "AdminTabs", "Sohbetler"); 
            const newValue = isOkControlState.includes("Member") ? "Seku,Admin" : "Seku,Admin,Member"; 
            
            await updateDoc(docRef, {
                isOkFor: newValue 
            });
    
            await autoMessageForIsOkFromAdmin();
            
            console.log("isOkFor güncellendi:", newValue);
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            toast.error("Güncellenirken bir hata oluştu");
        }
    };
    

    const getIsOkForChat = async () => {
        try {
            const isOkCollection = collection(db, "AdminTabs");
            const isOkSnapshot = await getDocs(isOkCollection);
            
            const isOkList = isOkSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
    
            const isOkControl = isOkList.find(item => item.id === "Sohbetler");
            const isOkControlValue = isOkControl?.isOkFor; 
            
            if (isOkControlValue) {
                const partedList = isOkControlValue.split(",");
                setIsOkControlState(partedList);
            } else {
                console.log("Sohbetler kontrolü bulunamadı.");
            }
        } catch (error) {
            console.error("Hata:", error);
            toast.error("Sohbet yazışma kontrolü çekilirken hata oluştu");
            setIsOkError(true);
        }
    };
    
    const listenForChatStatusChanges = () => {
        const docRef = doc(db, "AdminTabs", "Sohbetler");
        onSnapshot(docRef, (doc) => {
            const data = doc.data();
            const isOkValue = data.isOkFor;
            const partedList = isOkValue ? isOkValue.split(",") : [];
            setIsOkControlState(partedList);
        });
    };
    
    useEffect(() => {
        listenForChatStatusChanges();
    }, []);
    

    useEffect(() => {
            getIsOkForChat();
    }, []);

    useEffect(() => {
        setCookies('systemSenderInfo', systemSenderInfo, { path: '/', maxAge: 31536000 }); 
    }, [systemSenderInfo]);

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: "12px"
        },
    };

    return (
        <>
            <Modal style={customStyles} isOpen={modalOpen}>
                <div className="flex flex-col p-2 w-[500px]">
                    <div className="flex justify-between items-center">
                        <p className="text-xl inter-600">Sohbet Ayarları</p>
                        <img src={Close} className="invert w-[40px]" onClick={() => setModalOpen(!modalOpen)} alt="" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mt-5">
                        <button onClick={() => {updateIsOkFor(); getIsOkForChat();}} className={`${isOkError ? "opacity-50" : "opacity-100"} ${isOkControlState.includes("Member") ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} transition-all duration-300 outline-0 rounded-lg px-4 py-2 text-white inter-500`}>{isOkControlState.includes("Member") ? "Sohbeti yazışmaya kapat" : "Sohbetin yazışmasını aç"}</button>
                        <button onClick={() => clearLiveChat()} className="bg-red-500 hover:bg-red-600 transition-all duration-300 outline-0 rounded-lg px-4 py-2 text-white inter-500">Sohbeti tamamen temizle</button>
                        <div className="flex items-center">
                            <p className="inter-500">Sistem mesajlarında değişiklik yaparsan, ismin belirtilecek</p>
                            <Switch defaultChecked={systemSenderCookie.systemSenderInfo} onChange={(e) => setSystemSenderInfo(e.target.checked)}/>
                        </div>
                    </div>
                </div>
            </Modal>
            <div className="flex flex-col h-full relative">
                {
                    userInfoRole === "Seku" || userInfoRole === "Admin" ? 
                    <button onClick={() => setModalOpen(!modalOpen)} className="bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-4 py-2 transition-all duration-300 inter-500 absolute end-0 top-0 outline-0">
                        Sohbet ayarları
                    </button>
                    :
                    ""
                }
                <div className="flex flex-col">
                    <p className="text-center text-2xl inter-500">Sohbetler</p>
                    <p className="text-center inter-500">Deneyseldir, sohbet herkese açıktır</p>
                    <div className={`flex flex-col overflow-auto ${userInfoRole === "Seku" || userInfoRole === "Admin" ? "h-[570px]" : "h-[620px]"} `} id="mappingDiv">
                        {messageInside.map((message) => (
                            <div key={message.id} className='w-full flex items-center justify-start'> 
                                <img src={User} className={`w-[60px] ${darkMode ? "" : "invert"}`} alt="User" />
                                <div className="flex flex-col">
                                    <p className='text-sky-500 inter-600'>{message.name}</p>
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        ))}
                        <div ref={endOfMessagesRef} />
                    </div>
                </div>
                <div className="flex flex-col absolute bottom-0 w-full">
                    <div className="flex justify-center w-full gap-2">
                        {
                            isOkControlState.includes("Member") ? 
                            <div className="flex justify-center w-full gap-2">
                                <input 
                                    value={messageContent}
                                    autoComplete="off"
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    type="text"
                                    id="chatInput"
                                    className={`text-black px-2 rounded-lg w-[350px]`} 
                                    placeholder="Mesajınızı girin"
                                />
                                <button 
                                    className="px-4 py-2 rounded-lg transition-all bg-sky-500 hover:bg-sky-600 text-white outline-0" 
                                    onClick={addMessage}>
                                    {loading ? 
                                        <ProgressSpinner style={{width: '25px', height: '25px'}} strokeWidth="8" animationDuration=".5s" />
                                    :
                                        <img src={Send} className="w-[25px] h-[25px]" alt="Send" />
                                    }
                                </button>
                            </div>
                            :
                            <div className="bg-sky-500 hover:bg-sky-600 transition-all cursor-pointer duration-300 px-4 py-2 rounded-lg text-white">
                                <p className={`${userInfoRole === "Seku" || userInfoRole === "Admin" ? "mb-2 text-center" : ""}`}>Sohbet, şu anda sohbete kapalı {userInfoRole === "Seku" || userInfoRole === "Admin" ? "(Üyeler yazamaz)" : ""}</p>
                                {userInfoRole === "Seku" || userInfoRole === "Admin" ? 
                                    <div className="flex justify-center w-full gap-2">
                                    <input 
                                        value={messageContent}
                                        autoComplete="off"
                                        onKeyDown={handleKeyDown}
                                        onChange={(e) => setMessageContent(e.target.value)}
                                        type="text"
                                        id="chatInput"
                                        className={`text-black px-2 rounded-lg w-[350px]`} 
                                        placeholder="Mesajınızı girin"
                                    />
                                    <button 
                                        className="px-4 py-2 rounded-lg transition-all bg-sky-500 hover:bg-sky-600 text-white outline-0" 
                                        onClick={addMessage}>
                                        {loading ? 
                                            <ProgressSpinner style={{width: '25px', height: '25px'}} strokeWidth="8" animationDuration=".5s" />
                                        :
                                            <img src={Send} className="w-[25px] h-[25px]" alt="Send" />
                                        }
                                    </button>
                                </div>
                                :
                                ""
                            }
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chat;
