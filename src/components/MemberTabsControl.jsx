import { db } from '../firebase/Firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import "../css/memberTabsControl.css"


const MemberTabsControl = () => {

    const [adminTabsValue, setAdminTabsValue] = useState()

    const getAllTabs = async() => {
        try{
            const adminTabsCollection = collection(db, "AdminTabs");
            const querySnapshot = await getDocs(adminTabsCollection);
            const adminTabs = [];
            querySnapshot.forEach((doc) => {
                adminTabs.push({ id: doc.id, ...doc.data() });
            });
            console.log(adminTabs); // Burada belgeleri konsola yazdırabiliriz veya UI'da kullanabiliriz
            setAdminTabsValue(adminTabs)
            console.log(adminTabs[0].id)
            return adminTabs;
        }
        catch(error){
            toast.error("Sekme verileri çekilirken hata oluştu");
            setTimeout(() => {
                toast.dismiss();
            }, 2500)
        }
        
    }

    useEffect(() => {
        getAllTabs()
    }, [])

    return(
        <>
            <div className="flex flex-col">
                <p className="text-5xl inter-400">Üyelerin sekmelerini yönet</p>
            </div>
            <div>
                {adminTabsValue && adminTabsValue.map((tab,key) => {
                    console.log(key)
                    return(
                        <div className='flex items-center border-black-special' key={key}>
                            <p>{tab.id}</p>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default MemberTabsControl