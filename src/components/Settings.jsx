import React , {useContext} from 'react';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { DataContext } from "./MainContext"


const Settings = () => {

    const { darkMode, setDarkMode } = useContext(DataContext);

    const handleChange = () => {
        setDarkMode(!darkMode)
    }

    return(
        <>
            <div className="flex flex-col">
                <p className="text-center text-4xl inter-500">Ayarlar</p>
                <div className="flex flex-col mt-12 items-center">
                    <div className="flex items-center justify-between gap-24">
                        <p>Karanlık Mod</p>
                        <Switch checked={darkMode} onChange={handleChange}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings