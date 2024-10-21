import { useState, useEffect } from "react";

const SteamInfo = () => {

    const [data, setData] = useState([]); 

    const getUserInfo = () => {
        fetch("/api/steam?steamid=76561197960435530")
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