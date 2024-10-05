import { db } from '../firebase/Firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import "../css/memberTabsControl.css";
import "../css/main.css";
import { ProgressSpinner } from 'primereact/progressspinner';
import Modal from 'react-modal';
import CloseImg from "../images/close.svg";
import { InputSwitch } from 'primereact/inputswitch';
import PopoverTabControl from "../components/PopoverTabControl";
import { div } from 'framer-motion/client';

const MemberTabsControl = () => {
    const [adminTabsValue, setAdminTabsValue] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingState2, setLoadingState2] = useState(false);
    const [newRole, setNewRole] = useState(""); 

    // modal infos 
    const [tabName, setTabName] = useState("");
    const [tabsRoleSender, setTabsRoleSender] = useState("");

    // modal infos end
    const [editMode, setEditMod] = useState(false);
    const [roleSwitches, setRoleSwitches] = useState([]);

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    const getAllTabs = async () => {
        try {
            setLoadingState(true);
            const adminTabsCollection = collection(db, "AdminTabs");
            const querySnapshot = await getDocs(adminTabsCollection);
            const adminTabs = [];
            querySnapshot.forEach((doc) => {
                adminTabs.push({ id: doc.id, ...doc.data() });
            });
            setAdminTabsValue(adminTabs);
            setLoadingState(false);
        } catch (error) {
            setLoadingState(false);
            toast.error("Sekme verileri çekilirken hata oluştu");
            setTimeout(() => {
                toast.dismiss();
            }, 2500);
        }
    };

    useEffect(() => {
        getAllTabs();
    }, []);

    const handleOpenModal = (tab) => {
        setModalOpen(true);
        setTabName(tab.id);
        setTabsRoleSender(tab.show);

        const listedRoles = tab.show.split(",");
        const initialSwitchStates = listedRoles.map(role => ({ role, checked: true }));
        setRoleSwitches(initialSwitchStates);
    };

    const handleSwitchChange = (index) => {
        const updatedSwitches = roleSwitches.map((sw, i) =>
            i === index ? { ...sw, checked: !sw.checked } : sw
        );
        setRoleSwitches(updatedSwitches);
    };

    const handleAddRole = async () => {
        if (newRole.trim() !== "") {
            try {
                const updatedRoles = [...roleSwitches, { role: newRole, checked: true }];
                setRoleSwitches(updatedRoles);
    
                const adminTabDocRef = doc(db, "AdminTabs", tabName); 
                const rolesToUpdate = updatedRoles.map(roleSwitch => roleSwitch.role); 
                await updateDoc(adminTabDocRef, { show: rolesToUpdate.join(",") });
    
                toast.success("Yeni rol başarıyla eklendi!");
                setNewRole(""); 
            } catch (error) {
                toast.error("Yeni rol eklenirken bir hata oluştu.");
                console.error("Firebase hatası:", error);
            }
        }
    };

    const handleSaveRoles = async () => {
        try {
            const updatedRoles = roleSwitches
                .filter(roleSwitch => roleSwitch.checked)
                .map(roleSwitch => roleSwitch.role);

            const rolesString = updatedRoles.join(","); 

            const adminTabDocRef = doc(db, "AdminTabs", tabName); 
            await updateDoc(adminTabDocRef, { show: rolesString });

            toast.success("Roller başarıyla kaydedildi!");
            setModalOpen(false); 
            setEditMod(false);
        } catch (error) {
            toast.error("Roller kaydedilirken bir hata oluştu.");
        }
    };

    return (
        <>
            <Modal style={customStyles} isOpen={modalOpen} contentLabel='Başlık'>
                <div className="flex flex-col w-[500px]">
                    <div className="flex items-center justify-between">
                        <p className='inter-400 text-2xl'>{tabName} sekmesini yönet</p>
                        <img src={CloseImg} onClick={() => {setModalOpen(false); setEditMod(false)}} className='w-[35px] invert cursor-pointer' alt='Close' />
                    </div>
                    <div className='flex flex-col mt-12'>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className='inter-400 text-xl'>{tabName} şu kişiler tarafından görünür:</span>
                                <span className='inter-600 text-xl mt-2'>{tabsRoleSender}</span>
                            </div>
                            <button onClick={() => setEditMod(!editMode)} className='inter-500 bg-sky-500 transition-all duration-300 hover:bg-sky-600 py-1 px-5 text-white rounded-lg text-lg'>Düzenle</button>
                        </div>
                    </div>
                    {editMode ? 
                        <div className="flex flex-col mt-16">
                            <span className='text-xl inter-500'>Görecek yeni rolleri girin:</span>
                            {roleSwitches.map((roleSwitch, index) => (
                                <div key={index} className='flex items-center justify-between border-black-role-list p-3 rounded-lg my-2'>
                                    <span>{roleSwitch.role}</span>
                                    {roleSwitch.role === "Seku" ? 
                                    <InputSwitch
                                    checked
                                    disabled  
                                    /> : 
                                <InputSwitch
                                        checked={roleSwitch.checked}
                                        onChange={() => handleSwitchChange(index)}
                                    />}
                                    
                                </div>
                            ))}                
                            <div className='flex justify-center'>
                                <button 
                                    className='text-white text-lg rounded-lg bg-sky-500 hover:bg-sky-600 transition-all duration-300 py-1 px-8'
                                    onClick={handleSaveRoles}
                                >
                                    Kaydet
                                </button>
                            </div>    
                            <div className="flex items-center mt-3">
                                <span className='inter-400'>Eklenecek yeni rolleri girin: <span></span></span>
                            </div>
                            <input type="text" className='mt-1' value={newRole} onChange={(e) => setNewRole(e.target.value)} id='addTabsInRoles'/>
                            <div className='overflow-y-hidden mt-3 flex items-center'>
                                <button onClick={() => handleAddRole()} className='py-2 px-6 bg-sky-500 hover:bg-sky-600 transition-all duration-300 text-white inter-400 rounded-lg me-2'>Ekle</button>
                                <PopoverTabControl/>
                                {loadingState2 ? <ProgressSpinner /> : ""}
                            </div>
                        </div> : ""
                    }
                </div>
            </Modal>

            <div className="flex flex-col">
                <p className="text-5xl inter-400">Üyelerin sekmelerini yönet</p>
            </div>

            {loadingState ? (
                <div className='h-full w-full flex items-center justify-center'>
                    <ProgressSpinner />
                </div>
            ) : (
                <div className='mt-4 flex flex-col gap-4'>
                    {adminTabsValue && adminTabsValue.map((tab, key) => (
                        <div className='flex items-center justify-between border-black-special ps-5 py-2 rounded-lg' key={key}>
                            <p>{tab.id}</p>
                            <button onClick={() => handleOpenModal(tab)} className='inter-600 bg-sky-500 transition-all duration-300 hover:bg-sky-600 text-white me-2 rounded-lg px-4 py-1 flex items-center'>
                                <span>...</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

export default MemberTabsControl;
