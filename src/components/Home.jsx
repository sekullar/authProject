const Home  = ({ userInfoRole, userInfoName}) => {
    return(
        <>
            <p className="text-5xl inter-400">Hoşgeldin, {userInfoName}</p>
            <p className="inter-400 text-2xl">Şu anda rol önceliğiniz <span className="inter-600">{userInfoRole}</span>  olarak tanımlandı.</p>
            <p className="inter-400 text-2xl">Sol sekmelerden ihtiyacınız olan bütün sekmelere erişebilirsiniz.</p>
            <p className="inter-400 text-2xl">Ayarlar kısmından temanızı belirleyip işlemlerinze devam edebilirsiniz.</p>
            <p className="inter-400 text-2xl">Hesabınızla ilgili rol önceliği öğrenmek ve rol önceliği arttırma taleplerinde bulunmak için, hesap ayarlarına gidebilir, veya SSS => Kişisel Sorular kısmından talep oluşturabilirsiniz.</p>
        </>
    )
}

export default Home