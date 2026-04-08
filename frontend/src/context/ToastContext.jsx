import React, {createContext, useContext, useState} from "react";

const ToastContext = createContext();

export const ToastProvider = ({children}) => {
    const [toast, setToast] = useState({message: "", type: ""});

    function showToast(message, type = "success") {
        const id = Date.now()
        setToast({message, type, id});

        //will automatically remove after 3 sec.
        setTimeout(() => {
            setToast({message: "", type: "", id: null});
        }, 3000);
    }
    
    return (
        <ToastContext.Provider value={{toast, showToast}}>
            {children}
            <div className={`toast ${toast.type} ${toast.message ? 'show' : ''}`}>
                {toast.message}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    return useContext(ToastContext);
}