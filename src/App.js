import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import { useCookies } from 'react-cookie';
import { DataProvider } from './components/MainContext'; // Yolunu doğru ayarla
import { PrimeReactProvider } from 'primereact/api';
import { Analytics } from "@vercel/analytics/react"


function App() {
  const navigate = useNavigate(); // useNavigate artık Router içinde

  const [cookies, setCookies] = useCookies(['uid'])
  

  useEffect(() => {
    if(cookies.uid){
      console.log("runned", cookies.uid)
      navigate("/home")
    }
    else{
      navigate("/login"); // Yönlendirme  
    }
  }, [navigate]);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login" element={<Navigate to="/login" />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/" element={<Navigate to="/login" />} /> {/* Ana sayfayı login'e yönlendir */}
      </Routes>
    </>
  );
}

export default function Main() {
  return (
    <PrimeReactProvider>
      <DataProvider>
      <Router>
        <App />
      </Router>
    </DataProvider>
    </PrimeReactProvider>
  );
}
