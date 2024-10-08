import toast from 'react-hot-toast';
import { db } from '../firebase/Firebase';
import { collection, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Open from "../images/majesticons--open.svg"
import Bird from "../images/emojione-v1--bird.svg"
import { ProgressSpinner } from 'primereact/progressspinner';
import "../css/quickSite.css"

const QuickSite = () => {

    const [urlKeys, setUrlKeys] = useState();

    const [progressContent,setProgressContent] = useState(false);

    const getQuickSites = async () => {
        try {
            setProgressContent(true)
            const quickSiteCollection = collection(db, "AdminTabs", "XTools", "quickSiteUrl");
            const quickSiteSnapshot = await getDocs(quickSiteCollection);

            const quickSiteUrlsList = quickSiteSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUrlKeys(quickSiteUrlsList);
            setProgressContent(false)
        } catch (error) {
            setProgressContent(false)
            console.error("Hata:", error);
            toast.error("Siteler çekilirken bir hata oluştu");
        }
    };

    useEffect(() => {
        getQuickSites();
    }, []);

    return (
        <>
        <div className='flex flex-col gap-3'>
        {progressContent ? <div className='flex items-center justify-center'> <ProgressSpinner /> </div> : urlKeys && urlKeys.length > 0 ? 
        urlKeys && urlKeys.map((url, key) => {
            console.log(url.img);
            console.log(key);
            const keyUpper = key + 1;
            return (
                <div className="flex items-center justify-between border-quickSite p-3 rounded-xl" key={keyUpper}>
                    <div className="flex items-center gap-2">
                        <img src={url.img} className='w-[50px] rounded-lg' alt="" />
                        <div className="flex flex-col">
                            <p className='inter-500'>{url.name}</p>
                            <p className='inter-400'>{url.desc}</p> 
                        </div>
                    </div>
                    <a href={url.link} target='_blank' rel="noopener noreferrer">
                        <img src={Open} alt="Open" className='w-[30px]' />
                    </a>
                </div>
            );
        }) : <div className='flex items-center h-full w-full justify-center gap-3'>
        <img src={Bird} className='w-[25px]' alt='Bird' />
        <p className='inter-400 opacity-50'>Burası bomboş gözüküyor!</p>
        </div>}
        </div>
        </>
    );
}

export default QuickSite;
