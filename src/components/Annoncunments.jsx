import toast from 'react-hot-toast';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useEffect,useContext, useState } from 'react';
import { DataContext } from "./MainContext"
import Modal from 'react-modal';
import User from "../images/account.svg"
import Close from "../images/close.svg"
import { ref, onValue, push, get, child, set } from "firebase/database";
import { rtdb } from "../firebase/Firebase";  
import { useCookies } from "react-cookie";
import Send from "../images/mynaui--send.svg"



const Annoncunment = () => {

    const [cookies, setCookie, removeCookie] = useCookies(['uid']);

    const { userInfoRole, userInfoName } = useContext(DataContext)

    const [modalOpen,setModalOpen] = useState(false);
    const [messageContent,setMessageContent] = useState("");
    const [annoncunmentInside,setAnnoncunmentInside] = useState([])

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

      const addMessage = async () => {
        try {
            setMessageContent("");
            const usersRef = ref(rtdb, 'users');
    
            const snapshot = await get(usersRef);
            let index = 0;
    
            if (snapshot.exists()) {
                const data = snapshot.val();
                index = Object.keys(data).length; 
            }
    
            await set(child(usersRef, index.toString()), {
                name: userInfoName,
                message: messageContent
            });
            toast.success("Duyurunuz eklendi")
        } catch (error) {
            toast.error("Duyurunuz eklenirken bir hata oluştu")
        }
    };
    
      
      const getMessages = () => {
        try {
            const messagesRef = ref(rtdb, "users", cookies.uid);
            
            onValue(messagesRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const messagesList = Object.entries(data).map(([key, value]) => ({
                        id: key,  
                        ...value  
                    }));
                    console.log(messagesList);
                    setAnnoncunmentInside(messagesList);
                } else {
                    console.log("Veri bulunamadı");
                    setAnnoncunmentInside([]);
                }
            });
        } catch (error) {
            console.error("Duyuru mesajları çekilirken bir hata oluştu:", error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          addMessage();
        }
      };

    useEffect(() => {
        getMessages();
    }, [])

    return(
        <>
            <Modal isOpen={modalOpen} style={customStyles}>
                <div className="flex flex-col w-[400px]">
                    <div className="flex items-center justify-between">
                        <p className='inter-500 text-2xl'>Duyuru Ekle</p>
                        <img src={Close} className='w-[35px] invert' onClick={() => {setModalOpen(false)}} alt="Close" />
                    </div >
                    <div className="flex flex-col mt-12 ">
                        <p className='inter-500 text-xl mb-1'>Yeni eklenecek duyuru iletisini yazın: </p>
                        <input type="text" id='annoncunmentInput' className='outline-0 border rounded-lg px-2 py-1' value={messageContent} onChange={(e) => setMessageContent(e.target.value)}/>
                        <button className='bg-sky-500 hover:bg-sky-600 transition-all duration-300 px-4 py-2 rounded-lg inter-500 text-white mt-4' onClick={() => {addMessage();}}>Ekle</button>
                    </div>
                </div>
            </Modal>
            <div className='flex flex-col  relative h-full'>
                <p className='inter-500 text-4xl mb-3 text-center'>Duyurular 📣</p>
                <div className='overflow-auto flex flex-col items-start gap-5'>
                    {annoncunmentInside.map((message,index) => {
                        console.log(message)
                        return(
                            <div key={index} className='w-full flex items-center justify-start'>
                                <img src={User} className='w-[60px] invert' alt="User" />
                                <div className="flex flex-col">
                                    <p className='text-sky-500 inter-600'>{message.name}</p>
                                    <p>{message.message}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>{userInfoRole === "Seku" || userInfoRole === "Admin" ? 
                    <div className='absolute bottom-0 flex justify-center w-full'>
                        <input type="text" value={messageContent} onKeyDown={handleKeyDown} onChange={(e) => setMessageContent(e.target.value)} autoComplete='off' placeholder='Mesajınızı girin' className='border outline-0  me-2 rounded-lg w-1/2 px-2' id='annoncunmentInput'/>
                        <button className='bg-sky-500 hover:bg-sky-600 transition-all duration-300 inter-500 rounded-lg px-6 py-2 text-white ' onClick={() => addMessage()}><img src={Send} className='w-[25px]' alt='Send' /></button>
                    </div>
                    :
                    ""
                    }
            </div>
        </>
    )
}

export default Annoncunment