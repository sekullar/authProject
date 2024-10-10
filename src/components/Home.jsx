import Logo from "../images/logo.svg"

const Home  = ({ userInfoRole, userInfoName}) => {
    return(
        <>
            <p className="text-5xl inter-400">Hoşgeldin, {userInfoName}</p>
            <p className="inter-400 text-2xl">Şu anda rol önceliğiniz <span className="inter-600">{userInfoRole}</span>  olarak tanımlandı.</p>
            <p className="inter-400 text-2xl">Sol sekmelerden ihtiyacınız olan bütün sekmelere erişebilirsiniz.</p>
            <p className="inter-400 text-2xl">Ayarlar kısmından temanızı belirleyip işlemlerinze devam edebilirsiniz.(Şu anda aktif değil)</p>
            <p className="inter-400 text-2xl">Hesabınızla ilgili rol önceliği öğrenmek ve rol önceliği arttırma taleplerinde bulunmak için, hesap ayarlarına gidebilir, veya SSS => Kişisel Sorular kısmından talep oluşturabilirsiniz.</p>
            <div className="flex items-center gap-2 mt-12">
                <img src={Logo} className="w-[85px]" alt="Logo" />
                <p className="inter-200 text-5xl">Beta</p>
            </div>
        </>
    )
}

export default Home