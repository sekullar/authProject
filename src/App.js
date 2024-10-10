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
import { DataContext } from "./components/MainContext"
import { useContext } from "react"
import Banned from './components/Banned';


function App() {
  const navigate = useNavigate(); // useNavigate artık Router içinde

  const [cookies, setCookies] = useCookies(['uid'])

  const { banCheck } = useContext(DataContext)


  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path='/banned' element={<Banned />} />
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
