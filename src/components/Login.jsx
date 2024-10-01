import Firebase, { register,login } from "../firebase/Firebase"
import { useState } from "react"
import "../css/main.css"
import toast ,{ Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";


const Login = () => {

    
    const [email,setEmail] = useState();
    const [username,setUsername] = useState();
    const [password,setPassword] = useState();
    const [confirmPassword,setConfirmPassword] = useState();
    const navigate = useNavigate();
    const [loginScreen,setLoginScreen] = useState(true); 
    const [cookies, setCookie, removeCookie] = useCookies(['user']);


    const sendRegister = async e => {

        // 1 yıl sonra bitecek
        const inOneYear = new Date();
        inOneYear.setFullYear(inOneYear.getFullYear() + 1); 

        console.log("Send Register")
        e.preventDefault();
        if(confirmPassword != password){
            toast.error("Şifreniz birbiriyle uyuşmamaktadır!")
        }
        else{
            e.preventDefault();
            const user = await register(email,password,username)
            console.log(user)
            setCookie("uid", user.uid,{path: "/", expires: inOneYear})
            setTimeout(() => {
                navigate("/Homepage")
            }, 500)
        }   
    }

    const sendLogin = async e => {
         // 1 yıl sonra bitecek
         const inOneYear = new Date();
         inOneYear.setFullYear(inOneYear.getFullYear() + 1); 

        console.log("Send Login")
        e.preventDefault();
        if(password === ""){
            toast.error("Şifre boş bırakılamaz!")
        }
        else{
            const user = await login(email,password)
            console.log(user)
            setCookie("uid", user.uid,{path: "/", expires: inOneYear})
            setTimeout(() => {
                navigate("/Homepage")
            }, 500)
        }
    }

    return(
        <>
        <Toaster position="top-center"  />
        <div className="flex w-screen h-screen items-center justify-center" id="backdrop-blur">
            <div className="p-5 py-8 rounded-2xl flex flex-col justify-between mx-4 px-8 h-auto  w-[350px]" id="backdrop-white">
                {loginScreen ? <form className="flex flex-col justify-between select-none h-full gap-4" onSubmit={sendLogin}>
                    <p className="text-center text-2xl font-sans">Tekrar hoşgeldiniz!</p>
                    <input type="text" className="px-2 py-2 rounded-md mt-8" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Posta adresi"/>
                    <input type="password" className="px-2 py-2 rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre"/>
                    <button className="bg-fuchsia-100 transition-all duration-300 hover:bg-fuchsia-200 rounded-md py-2">Giriş yap</button>
                    <div className="flex items-center justify-between gap-4">
                        <p className="cursor-pointer" onClick={() => {setLoginScreen(false); setConfirmPassword(""); setEmail(""); setPassword("");}}>Kayıt Ol</p> <p className="cursor-pointer">Şifremi Unuttum</p>
                    </div>
                </form> :  <form className="flex flex-col justify-between select-none h-full gap-4" onSubmit={sendRegister}>
                    <p className="text-center text-2xl font-sans">Hoşgeldiniz!</p>
                    <input type="text" className="px-2 py-2 rounded-md" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Kullanıcı adı"/>
                    <input type="text" className="px-2 py-2 rounded-md" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-Posta adresi"/>
                    <input type="password" className="px-2 py-2 rounded-md" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Şifre"/>
                    <input type="password" className="px-2 py-2 rounded-md" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Şifre onayı"/>
                    <button className="bg-fuchsia-100 rounded-md py-2 transition-all duration-300 hover:bg-fuchsia-200">Giriş yap</button>
                    <div className="flex items-center justify-between gap-4">
                        <p className="cursor-pointer" onClick={() => {setLoginScreen(true); setConfirmPassword(""); setPassword(""); setEmail("")}}>Giriş Yap</p> <p className="cursor-pointer">Şifremi Unuttum</p>
                    </div>
                </form>}
              
            </div>
        </div>
        </>
    )
}

export default Login