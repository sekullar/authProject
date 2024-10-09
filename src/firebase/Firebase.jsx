import { initializeApp } from "firebase/app";
import { getAuth , createUserWithEmailAndPassword, useDeviceLanguage, signInWithEmailAndPassword, signOut } from "firebase/auth"
import toast, { Toaster } from 'react-hot-toast';
import { getFirestore, setDoc, doc  } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";





const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const db = getFirestore(app);


export const register = async (email,password,username,role,banControl) => {
  

  try{
    toast.loading("Yükleniyor...")
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db,"users",user.uid), {
      username: username,
      email: email,
      role: role,
      banned: banControl
    });
    toast.dismiss()
    toast.success("Kayıt olma işlemi başarılı")
    return user
  }
  catch (error){
    if(error.message == "Firebase: Error (auth/invalid-email)."){
      toast.error("E-Posta bilgileriniz doğru değil!")
    }
  }
   
}


export const login = async (email, password) => {
  try {
    toast.loading("Yükleniyor...");
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    toast.dismiss();
    toast.success("Giriş işlemi başarılı!");
    return user;
  } catch (error) {
    toast.dismiss();

    // Hata mesajını kontrol ederek özel bir toast göstermek
    switch (error.code) {
      case "auth/invalid-credential":
        toast.error("Kullanıcı adı veya şifre yanlış");
        break;
      case "auth/too-many-requests":
        toast.error("Çok fazla istekte bulundunuz, lütfen bir süre sonra tekrar");
        break;
      case "auth/invalid-email":
        toast.error("Geçersiz e-posta adresi!");
        break;
      default:
        toast.error("Giriş işlemi sırasında bir hata oluştu.");
        break;
    }

    return null;
  }
};

export { db };
export default app