import React, { createContext, useContext, useState } from "react";

const NavigateContext = createContext();

const NavigateProvider = ({ children }) => {
    const [navigateHomepage, setNavigateHomepage] = useState(false);  
    
    return(
        <NavigateContext.Provider value={{ navigateHomepage }}>
            {children}
        </NavigateContext.Provider>
    ) 
}

export default NavigateProvider



