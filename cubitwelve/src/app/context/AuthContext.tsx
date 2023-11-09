import { ReactNode, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    children?: ReactNode;
};

interface AuthContext{
    authenticated: boolean;
    setAuthenticated: (newState: boolean) => void;
}

const initialValue: AuthContext ={
    authenticated: false,
    setAuthenticated:() =>{},
};

const AuthContext = createContext<AuthContext>(initialValue);

const AuthProvider = ({children}: Props) => {
    const [authenticated,setAuthenticated] = useState(
        initialValue.authenticated
    );

    const navigate = useNavigate();

    return (
        <AuthContext.Provider value={{authenticated,setAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

export{ AuthContext, AuthProvider};