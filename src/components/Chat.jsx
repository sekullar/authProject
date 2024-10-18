import { ref, onValue, push, get, child, set } from "firebase/database";
import { rtdb } from "../firebase/Firebase";  
import Send from "../images/mynaui--send.svg"
import { useCookies } from "react-cookie";
import toast from 'react-hot-toast';
import { useContext, useEffect, useState} from "react";
import { DataContext } from "./MainContext";
import { ProgressSpinner } from 'primereact/progressspinner';
import "../css/chat.css"
import User from "../images/account.svg"






const Chat = () => {



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
    getMessages();
}, [])

    const [cookies, setCookie, removeCookie] = useCookies(['uid']);
    const { userInfoRole, userInfoName} = useContext(DataContext)
    const [messageContent,setMessageContent] = useState("");
    const [messageInside,setMessageInside] = useState([]);
    const [loading, setLoading] = useState(false);

    return(
        <>
        <div className="flex flex-col h-full relative">
            <div className="flex flex-col">
                    <p className="text-center text-2xl inter-500">Sohbetler</p>
                    <p className="text-center inter-500">Deneyseldir, sohbet herkese açıktır</p>
                    <div className="flex flex-col overflow-auto h-[654px]">
                        {messageInside.map((message,index) => {
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
                    </div>
            </div>
            <div className="flex flex-col absolute bottom-0 w-full">
                <div className="flex justify-center w-full gap-2">
                    <input value={messageContent} autoComplete="off" onKeyDown={handleKeyDown} onChange={(e) => setMessageContent(e.target.value)} type="text" id="chatInput" className={`text-black px-2 rounded-lg w-[350px]`} placeholder="Mesajınızı girin"/>
                    <button className="px-4 py-2 rounded-lg transition-all bg-sky-500 hover:bg-sky-600 text-white outline-0" onClick={() => addMessage()}>
                        {loading ? 
                            <ProgressSpinner style={{width: '25px', height: '25px'}} strokeWidth="8"  animationDuration=".5s" />
                    :
                        <img src={Send} className="w-[25px] h-[25px]" alt="Send" />
                    }
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

export default Chat