import "../css/main.css"
import Content from "./Content"
import Header from "./Header"
import Sidebar from "./Sidebar"

const Homepage = () => {
    return(
        <>
            <div className="flex flex-col gap-3 h-screen">
               <Header/>
               <div className="flex items-center h-full">
                <Sidebar />
                <Content/>
               </div>
            </div>
        </>
    )
}

export default Homepage