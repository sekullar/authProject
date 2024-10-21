import { useState, useEffect } from "react";

const SteamInfo = () => {

    const [data, setData] = useState([]); 

    const getUserInfo = () => {
        fetch("https://cors-anywhere.herokuapp.com/http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=DB773A873E356C67C98A46975F10B53A&steamids=76561197960435530")
        .then((response) => {
            if (!response.ok) {
                throw new Error('Veri çekilemedi!');
            }
            return response.json(); 
        })
        .then((data) => {
            console.log(data)
        })
        .catch((error) => {
            console.log(error)
        });
    };
    
    useEffect(() => {
        getUserInfo();
    }, [])

    return(
        <>

        </>
    )
}

export default SteamInfo