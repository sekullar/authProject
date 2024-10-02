import { Accordion, AccordionTab } from 'primereact/accordion';
import { db } from '../firebase/Firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useContext, useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataContext } from './MainContext';
import "../css/main.css"



    
const Sidebar = () => {

    const [tabListState,setTabListState] = useState();
    const [loadingTabs, setLoadingTabs] = useState(true);

    const { userInfoRole } = useContext(DataContext);
    const { contentValue,setContentValue } = useContext(DataContext);
    


    useEffect(() => {
        getTabs()
    }, [])

    const getTabs = async () => {
        setLoadingTabs(true)
        try {
            const tabsCollection = collection(db, "AdminTabs");
            const tabsSnapshot = await getDocs(tabsCollection);
            const tabsList = tabsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTabListState(tabsList);
            console.log("tabsList",tabsList);
            setLoadingTabs(false)
            return tabsList;
        } catch (error) {
            setLoadingTabs(false)
            console.log(error);
            toast.error("Sekme verileri alınırken hata oluştu, lütfen konsolu kontrol edin.");
        }
    };
        
    useEffect(() => {
        setContentValue("home")
    }, [])

    return(
        <>
        <div className='bg-white m-2 p-5 rounded-lg mt-1 w-[350px] h-full mb-5'>
        {loadingTabs ?
            <div className='flex items-center justify-center h-full'>
                 <ProgressSpinner /> 
            </div>
        :  <Accordion className='flex flex-col gap-4'>
        {tabListState && tabListState.map((tab) => {
            const keyName = tab.id; 
            console.log(keyName);
            console.log(tab)
            const tabKeys = Object.keys(tab).filter(key => key !== 'id');
            const isMemberRole = userInfoRole === 'member';

            
            return (
                <AccordionTab 
                className={keyName === "Üye Sekmeleri" && isMemberRole ? "hidden" : "isOk"} 
                header={<span className='text-xl inter-500'>{keyName}</span>} 
                key={keyName}
            >
                {tabKeys.map((subKey) => (
                    <div key={subKey} className='flex flex-col gap-2 my-1'>
                        <span 
                            className='inter-400 cursor-pointer' 
                            onClick={() => setContentValue(tab[subKey])} 
                        >
                            {tab[subKey]} 
                        </span>
                    </div>
                ))}
            </AccordionTab>
            
            );
        })}
    </Accordion>}    
        </div>
           
        </>
    )
}

export default Sidebar