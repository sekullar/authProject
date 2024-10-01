import { Accordion, AccordionTab } from 'primereact/accordion';
import { db } from '../firebase/Firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import "../css/main.css"



    
const Sidebar = () => {

    const [tabListState,setTabListState] = useState();
    const [loadingTabs, setLoadingTabs] = useState(true);


    useEffect(() => {
        getTabs()
    }, [])

    const getTabs = async () => {
        setLoadingTabs(true)
        try {
            const tabsCollection = collection(db, "AdminTabs");
            const tabsSnapshot = await getDocs(tabsCollection);
            // doc.data() fonksiyonunu çağırdığınızdan emin olun
            const tabsList = tabsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTabListState(tabsList);
            console.log(tabsList);
            setLoadingTabs(false)
            return tabsList;
        } catch (error) {
            setLoadingTabs(false)
            console.log(error);
            toast.error("Sekme verileri alınırken hata oluştu, lütfen konsolu kontrol edin.");
        }
    };
        

    return(
        <>
        <div className='bg-white m-2 p-5 rounded-lg mt-1 w-[250px] h-full mb-5'>
        {loadingTabs ?
            <div className='flex items-center justify-center h-full'>
                 <ProgressSpinner /> 
            </div>
        :  <Accordion className='flex flex-col gap-4'>
        {tabListState && tabListState.map((tab) => {
            const keyName = tab.id; 
            console.log(keyName);
    
            const tabKeys = Object.keys(tab).filter(key => key !== 'id');
    
            return (
                <AccordionTab header={
                    <span className='text-xl inter-500'>{keyName}</span>
                } key={keyName}>
                    {tabKeys.map((subKey) => (
                        <div key={subKey} className='flex flex-col gap-2 my-1'>
                            <span className='inter-400 cursor-pointer'>{subKey} </span>{tab[subKey]}
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