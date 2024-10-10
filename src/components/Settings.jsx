import Switch, { SwitchProps } from '@mui/material/Switch';

const Settings = () => {
    return(
        <>
            <div className="flex flex-col">
                <p className="text-center text-4xl inter-500">Ayarlar</p>
                <div className="flex flex-col mt-12 items-center">
                    <div className="flex items-center justify-between gap-24">
                        <p>Karanlık Mod</p>
                        <Switch />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings