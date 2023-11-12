import { ReactNode, createContext, useState, useEffect } from "react";
import Agent from "../api/agent";
//cimport { useNavigate } from "react-router-dom";

type Props = {
    children?: ReactNode;
};

interface AuthContext {
    authenticated: boolean;
    setAuthenticated: (newState: boolean) => void;
}

const initialValue: AuthContext = {
    authenticated: false,
    setAuthenticated: () => {},
};

const AuthContext = createContext<AuthContext>(initialValue);

const AuthProvider = ({ children }: Props) => {
    const [authenticated, setAuthenticated] = useState(initialValue.authenticated);

    useEffect(() => {
        // Verificar la existencia del token al cargar la aplicación
        const storedToken = localStorage.getItem("token");
        if (storedToken) { // Asignar el token al agente
            Agent.token = storedToken; // Limpiar el token en el agente
            setAuthenticated(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
