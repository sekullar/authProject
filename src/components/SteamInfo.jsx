import { useState, useEffect, useContext } from "react";
import { DataContext } from "./MainContext";
import toast from "react-hot-toast";
import { ProgressSpinner } from 'primereact/progressspinner';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import "../css/steamInfo.css"
import Modal from 'react-modal';
import Close from "../images/close.svg";
import Magnify from "../images/mdi--magnify.svg"


const SteamInfo = () => {

    const responsive = {
        superLargeDesktop: {
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };

    const [steamIdLogin,setSteamIdLogin] = useState(true);
    const [searchId,setSearchId] = useState("");
    const [playerId,setPlayerId] = useState("");
    const {darkMode} = useContext(DataContext)
    const [loading,setLoading] = useState(false)
    const [allOwnedGamesModal,setAllOwnedGamesModal] = useState(false);

    const [urlLogin,setUrlLogin] = useState("");
    const [usernameSteam,setUsernameSteam] = useState("");
    const [dataPlayerProfile, setDataPlayerProfile] = useState([]);
    const [dataPlayerFriend, setDataPlayerFriend] = useState([]); 
    const [dataPlayerRecentlyPlayed,setDataPlayerRecentlyPlayed] = useState([]);
    const [dataOwnedGames,setDataOwnedGames] = useState([]);
    const [ownedGamesCount,setOwnedGamesCount] = useState(0);
    const [steamAllApps, setSteamAllApps] = useState({ applist: { apps: [] } }); 

    const [searchTerm, setSearchTerm] = useState("");


    const [friendError,setFriendError] = useState(false);


    const getFormattedDateTime = (timestamp) => {
        const date = new Date(timestamp * 1000); 
        const options = { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }; 
        return date.toLocaleString('tr-TR', options); 
    };

    const findGameName = (appId) => {
        const game = steamAllApps.applist.apps.find((app) => app.appid === appId);
        return game ? game.name : "Oyun bulunamadı";
    };

    useEffect(() => {
        fetch("https://api.steampowered.com/ISteamApps/GetAppList/v2/")
            .then((response) => response.json())
            .then((data) => {
                setSteamAllApps(data); 
            })
            .catch((error) => {
                console.error("Oyun listesi yüklenirken bir hata oluştu:", error);
            });
    }, []); 
    
    const getPlayerID = () => {
        setSteamIdLogin(false);
        setLoading(true);
        console.log("getPlayerId Started");
        fetch(`https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=DB773A873E356C67C98A46975F10B53A&vanityurl=${playerId}`)
        .then((response) => {
            if (!response.ok) {
                setLoading(false);
                toast.error("Veriler çekilirken bir hata oluştu!");
            }
            return response.json(); 
        })
        .then((data) => {
            if (data.response && data.response.steamid) {
                setSearchId(data.response.steamid);
                console.log("Eşleşen kimlik:", data.response.steamid);
                getPlayerInfo(data.response.steamid); 
                getFriendList(data.response.steamid)
                getOwnedGames(data.response.steamid);
                getRecentlyPlayed(data.response.steamid)
                setSteamIdLogin(false)
            } else {
                setLoading(false);
                toast.error("Steam ID bulunamadı!");
            }
        })
        .catch((error) => {
            console.log(error);
            setLoading(false);
        });
    };
    

    const findUrl = () => {
        setLoading(true);
        
    }

    const getPlayerInfo = (steamId) => {
        console.log("player Info func started", steamId);
        setLoading(true); 
        fetch(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=DB773A873E356C67C98A46975F10B53A&steamids=${steamId}`)
        .then((response) => {
            if (!response.ok) {
                setLoading(false);
                toast.error("Veriler çekilirken bir hata oluştu!");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data.response.players);
            setUsernameSteam(data.response.players[0].personaname);
            setDataPlayerProfile(data.response.players)
        })
        .catch((error) => {
            console.error(error);
        });
    };

    const getFriendList = (steamId) => {
        fetch(`http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=DB773A873E356C67C98A46975F10B53A&steamid=${steamId}&relationship=friend`)
        .then((response) => {
            if (!response.ok) {
                setLoading(false);
                toast.error("Veriler çekilirken bir hata oluştu!");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data.friendslist.friends);
            setDataPlayerFriend(data.friendslist.friends);
        })
        .catch(() => {
            setFriendError(true);
        })
    }

    const getOwnedGames = (steamId) => {
        fetch(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=DB773A873E356C67C98A46975F10B53A&steamid=${steamId}&format=json`)
        .then((response) => {
            if (!response.ok) {
                setLoading(false);
                toast.error("Veriler çekilirken bir hata oluştu!");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            setOwnedGamesCount(data.response.game_count);
            setDataOwnedGames(data.response.games);
            setLoading(false)
        })
    }

    const getRecentlyPlayed = (steamId) => {
        fetch(`http://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v0001/?key=DB773A873E356C67C98A46975F10B53A&steamid=${steamId}&format=json`)
        .then((response) => {
            if (!response.ok) {
                setLoading(false);
                toast.error("Veriler çekilirken bir hata oluştu!");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            setDataPlayerRecentlyPlayed(data.response.games);
            setLoading(false)
        })
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            getPlayerID();
        }
    };

    const handleKeyPress2 = (event) => {
        if (event.key === 'Enter') {
            try{
                getPlayerID(urlLogin);
                getPlayerInfo(urlLogin); 
                getFriendList(urlLogin)
                getOwnedGames(urlLogin);
                getRecentlyPlayed(urlLogin)
                setSteamIdLogin(false)
            }
            catch{
                toast.error("Veriler çekilirken hata oluştu!")
            }
            
        }
    };

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: "12px",
            maxHeight: "calc(100vh - 50px)",
            height: "calc(100vh - 50px)",
            minWidth: "500px"
        },
    };

    return(
        <>
        <Modal style={customStyles} isOpen={allOwnedGamesModal}>
            <div className="flex flex-col max-w-[500px] overflow-auto py-4 relative" id="scrollFriends">
                <img src={Close} className="absolute end-0 top-0 invert w-[40px] mt-4" onClick={() => setAllOwnedGamesModal(!allOwnedGamesModal)} alt="" />
                <p className="inter-500 text-3xl">{usernameSteam} kişisinin Kütüphanesi</p>
                <div className="flex p-2 items-center border w-[180px] my-5 rounded-lg">
                    <input type="text" id="searchGameModal" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="outline-0 w-[130px]" placeholder="Oyun arayın..."/>
                    <img src={Magnify} className="invert w-[35px]" alt="" />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                {dataOwnedGames.filter((info) => {
                            const gameName = findGameName(info.appid).toLowerCase();
                            return gameName.includes(searchTerm.toLowerCase()); 
                        })
                        .map((info, key) => {
                            const gameName = findGameName(info.appid);
                            return (
                                <div key={key} className="item flex flex-col mt-4">
                                    <p className="inter-500">Oyun: {gameName}</p>
                                    <p>Oynanılan toplam süre: {info.playtime_forever} dakika</p>
                                </div>
                            );
                        })}
                </div>
            </div>
        </Modal>
        {loading ? 
        <div className="h-full w-full flex items-center justify-center">
            <ProgressSpinner />
        </div>
        :
         steamIdLogin ? 
         <div className="flex flex-col items-center">
            <p className="text-3xl text-center inter-500">Steam Profil Analizi</p>
            <div className="flex items-center gap-12">
                <div className="flex flex-col">
                    <div className="flex flex-col items-center mt-12 gap-3">
                        <p className="inter-400">Lütfen Steam ID'nizi girin.</p>
                        <input type="text" onKeyDown={handleKeyPress} className="rounded-lg text-black" value={playerId} onChange={(e) => setPlayerId(e.target.value)} placeholder="Steam ID" />
                        <button className="bg-purple-500 hover:bg-purple-600 transition-all duration-300 inter-500 px-8 py-2 rounded-lg" onClick={() => getPlayerID()}>Ara</button>
                    </div>
                </div> 
                <p className="inter-600">yada</p> 
                <div className="flex flex-col">
                    <p className="text-3xl text-center inter-500"></p>
                    <div className="flex flex-col items-center mt-12 gap-3">
                        <p className="inter-400">Lütfen Steam URL'nizi girin.</p>
                        <input type="text" onKeyDown={handleKeyPress2} className="rounded-lg text-black" value={urlLogin} onChange={(e) => setUrlLogin(e.target.value)} placeholder="Steam URL" />
                        <button className="bg-purple-500 hover:bg-purple-600 transition-all duration-300 inter-500 px-8 py-2 rounded-lg" onClick={() => findUrl()}>Ara</button>
                    </div>
                </div> 
            </div>
         </div>
         :
         <div className="flex flex-col">
            <div>
                {dataPlayerProfile.map((info, key) => {
                    const DeTimestamp = info.timecreated;
                    const dateTime = (typeof DeTimestamp === "number" && DeTimestamp > 0) 
                        ? getFormattedDateTime(DeTimestamp) 
                        : null; 
                    console.log(dateTime ? dateTime : "Geçersiz zaman damgası"); 
                    console.log(info); 

                    const DeTimeStampLastLogOff = info.lastlogoff;
                    const lastLogOffDateTime = (typeof DeTimeStampLastLogOff === "number" && DeTimeStampLastLogOff > 0)
                    ? getFormattedDateTime(DeTimeStampLastLogOff)
                    : null;
                    console.log(lastLogOffDateTime ? lastLogOffDateTime : "Geçersiz zaman damgası"); 
                    return (
                        <div key={key} className="flex flex-col">
                            <div className="flex items-center">
                                <img src={info.avatarfull} className="rounded-lg" alt="Avatar" />
                                <div className="flex flex-col">
                                    <p className="inter-500 text-2xl ms-3">{info.personaname}</p>
                                    <p className="inter-500 text-lg ms-3">Steam ID: {info.steamid}</p>
                                    <p className="inter-500 text-lg ms-3">{dateTime ? dateTime + " tarihinde hesap oluşturuldu." : "Hesap oluşturulma tarihi geçersiz."}</p>
                                    <p className="inter-500 text-lg ms-3">{lastLogOffDateTime ? `En son ${lastLogOffDateTime} tarihinde aktif oldu` : "Aktiflik tarihi geçersiz"}</p>
                                    <div className="mt-3">
                                        <a href={info.profileurl} target="_blank" className="bg-purple-500 hover:bg-purple-600 transition-all duration-300 px-4 py-2 rounded-lg text-white ms-3">Profile göz at</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between mt-5">
                <div>
                    <p className="inter-700 text-4xl">En son oynanan</p>
                    <div className="flex flex-col max-h-[250px] overflow-auto mt-5" id="scrollFriends">
                        {dataPlayerRecentlyPlayed.map((info,key) => {
                            return(
                                <div key={key} className="flex gap-2 flex-col mt-5">
                                    <p className="inter-600 text-3xl">{info.name}</p>
                                    <p className="inter-500">App ID: {info.appid}</p>
                                    <p className={`${info.playtime_2weeks ? "ok" : "hidden"}`}>Son 2 haftada {info.playtime_2weeks} dakika oynandı.</p>
                                    <p className={`${info.playtime_deck_forever ? "ok" : "hidden"}`}>Steam Desk ile {info.playtime_deck_forever} dakika oynandı.</p>
                                    <p className={`${info.playtime_linux_forever ? "ok" : "hidden"}`}>Linux üzerinden toplamda {info.playtime_linux_forever} dakika oynandı.</p>
                                    <p className={`${info.playtime_windows_forever ? "ok" : "hidden"}`}>Windows üzerinden toplamda {info.playtime_windows_forever} dakika oynandı.</p>
                                    <p className="text-lg inter-600">Toplamda {info.playtime_forever} dakika oynandı.</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <p className="inter-500 text-lg">Arkadaşlarınız</p>
                    {
                        friendError ? 
                        <div className="max-w-[300px]">
                            <p className="inter-500 text-center mt-3">Profilinizin arkadaş kısmı gizlidir. Görebilmek için lütfen gizliliği kapatın.</p>
                        </div>
                        :
                        <div className="flex flex-col items-center gap-3 max-h-[300px] px-2 overflow-auto" id="scrollFriends">
                        {dataPlayerFriend.map((info,key) => {
                            const friendStartDate = info.friend_since;
                            const frindStartDateString = getFormattedDateTime(friendStartDate);
                            return(
                                <div key={key} className="flex flex-col w-[250px] border p-2 gap-2 rounded-lg">
                                    <div className="flex items-center">
                                        <p className="inter-500">ID:</p>
                                        <p className="inter-500">{info.steamid}</p>
                                    </div>
                                    <div className="flex flex-col ">
                                        <p className="inter-500">{frindStartDateString}</p>
                                        <p className="inter-500">tarihinden beri arkadaşsınız.</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    }
                    
                </div>
            </div>
            <div className="flex flex-col mt-12">
            <p className="inter-600 text-2xl">{usernameSteam} kişisinin kütüphanesi</p>
            <Carousel responsive={responsive}>
                {dataOwnedGames.map((info, key) => {
                    const gameName = findGameName(info.appid);
                    return (
                        <div key={key} className="item flex flex-col items-center mt-4">
                            <p className="inter-600 text-nowrap">Oyun: {gameName}</p>
                            <p className="inter-500 text-nowrap">Oynanılan toplam süre: {info.playtime_forever} dakika</p>
                        </div>
                    );
                })}
            </Carousel>
            <div className="mt-3">
                <button className="bg-purple-500  hover:bg-purple-600 transition-all duration-300 text-white px-4 py-2 outline-0 rounded-lg inter-500" onClick={() => setAllOwnedGamesModal(!allOwnedGamesModal)}>Tümüne gözat</button>
            </div>
        </div>
            
         </div>
        }
            
        </>
    )
}

export default SteamInfo