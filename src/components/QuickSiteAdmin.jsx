import toast from 'react-hot-toast';
import { db } from '../firebase/Firebase';
import { addDoc, collection, getDocs,deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Open from "../images/majesticons--open.svg";
import Delete from "../images/ant-design--delete-outlined.svg";
import Close from "../images/close.svg";
import Bird from "../images/emojione-v1--bird.svg"
import Modal from 'react-modal';
import "../css/quickSite.css";
import { ProgressSpinner } from 'primereact/progressspinner';

const QuickSiteAdmin = () => {
    const [urlKeys, setUrlKeys] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);

    const [photoLink, setPhotoLink] = useState("");
    const [siteName, setSiteName] = useState("");
    const [siteDesc, setSiteDesc] = useState("");
    const [siteLink, setSiteLink] = useState("");
    const [progressLoading,setProgressLoading] = useState(false)
    const [progressDelete,setProgressDelete] = useState(false)
    const [progressContent, setProgressContent] = useState(false)

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

    const AddQuickSites = async () => {
        try {
            setProgressLoading(true)
            const quickSiteCollection = collection(db, "AdminTabs", "XTools", "quickSiteUrl");
            await addDoc(quickSiteCollection, {
                name: siteName,
                link: siteLink,
                desc: siteDesc,
                img: photoLink
            });
            setProgressLoading(false)
            getQuickSites(); 
            setModalOpen(false);
        } catch (error) {
            console.error("Hata:", error);
            setProgressLoading(false)
            toast.error("Quick site eklenirken hata oluştu");
        }
    };

    const deleteQuickSites = async (docId) => {
        try{
            setProgressDelete(true)
            const docRef = doc(db,"AdminTabs","XTools","quickSiteUrl",docId);
            await deleteDoc(docRef);
            toast.success("Quick Site silindi");
            getQuickSites();
            setProgressDelete(false)
        }
        catch{
            setProgressDelete(false)
            toast.error("Quick Site silinirken bir hata oluştu")
        }
    }

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
            <Modal isOpen={modalOpen} style={customStyles}>
                <div className="flex flex-col relative p-4 gap-5 w-[350px]">
                    <div className='flex items-center justify-between'>
                        <p className='inter-500 text-3xl'>Quick Site Ekle</p>
                        <img src={Close} onClick={() => setModalOpen(false)} className='w-[40px] invert cursor-pointer' alt="" />
                    </div>
                    <div className='flex flex-col'>
                        <p className='inter-400 mb-2'>Fotoğraf linki</p>
                        <input type="text" placeholder='Fotoğraf linki' onChange={(e) => setPhotoLink(e.target.value)} />
                    </div>
                    <div className='flex flex-col '>
                        <p className='inter-400 mb-2'>İsim</p>
                        <input type="text" placeholder='İsim' onChange={(e) => setSiteName(e.target.value)} />
                    </div>
                    <div className='flex flex-col '>
                        <p className='inter-400 mb-2'>Açıklama</p>
                        <input type="text" placeholder='Açıklama' onChange={(e) => setSiteDesc(e.target.value)} />
                    </div>
                    <div className='flex flex-col'>
                        <p className='inter-400 mb-2'>Site linki</p>
                        <input type="text" placeholder='Site linki' onChange={(e) => setSiteLink(e.target.value)} />
                    </div>
                    <button className='inter-500 text-white bg-purple-500 hover:bg-purple-600 transition-all duration-300 px-4 py-2 rounded-lg text-lg' onClick={AddQuickSites}>{progressLoading ? <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8"  animationDuration=".5s" /> : "Ekle"}</button>
                </div>
            </Modal>
            <div className='relative h-full flex flex-col gap-3'>
            {progressContent ? <div className='flex items-center justify-center'> <ProgressSpinner /> </div> : urlKeys && urlKeys.length > 0 ?
                    urlKeys && urlKeys.map((url) => {
                    return(
                        <div className="flex items-center justify-between border-quickSite p-3 rounded-xl" key={url.id}>
                            <div className="flex items-center gap-2">
                                <img src={url.img} className='w-[50px] rounded-lg' alt={url.name} />
                                <div className="flex flex-col">
                                    <p className='inter-500'>{url.name}</p>
                                    <p className='inter-400'>{url.desc}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <a href={url.link} target='_blank' rel="noopener noreferrer">
                                    <img src={Open} alt="Open" className='w-[30px]' />
                                </a>
                                {progressDelete ? <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8"  animationDuration=".5s" /> : <img src={Delete} className='w-[30px]' onClick={() => deleteQuickSites(url.id)} alt="Delete" />}
                            </div>
                        </div>
                    )
                    }) : <div className='flex items-center h-full w-full justify-center gap-3'>
                        <img src={Bird} className='w-[25px]' alt='Bird' />
                        <p className='inter-400 opacity-50'>Burası bomboş gözüküyor!</p>
                        </div>}
            
                <div className="flex justify-center">
                    <button className='bg-purple-500 hover:bg-purple-600 transition-all duration-300 rounded-lg text-white outline-0 px-4 py-2 inter-500 absolute bottom-0' onClick={() => setModalOpen(true)}>Quick Site ekle</button>
                </div>
            </div>
        </>
    );
}

export default QuickSiteAdmin;
