import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./components/Login";
import Homepage from "./components/Homepage";
import { useCookies } from 'react-cookie';

function App() {
  const navigate = useNavigate(); // useNavigate artık Router içinde

  const [cookies, setCookies] = useCookies(['uid'])

  useEffect(() => {
    if(cookies.uid){
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
        <Route path="/home" element={<Homepage />} />
        <Route path="/" element={<Navigate to="/login" />} /> {/* Ana sayfayı login'e yönlendir */}
      </Routes>
    </>
  );
}

export default function Main() {
  return (
    <Router>
      <App />
    </Router>
  );
}
