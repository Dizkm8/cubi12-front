import { ReactNode, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {
    children: React.ReactNode;
};

interface auth_context {
    authenticated: boolean;
    set_authenticated: (newState: boolean) => void;
}

const initial_value: auth_context = {
    authenticated: false,
    set_authenticated: () => {},
};

const auth_context = createContext<auth_context>(initial_value);

const auth_provider = ({ children }: Props) => {
    const [authenticated, set_authenticated] = useState(
        initial_value.authenticated
    );

    const navigate = useNavigate();

    return (
        <auth_context.Provider value={{ authenticated, set_authenticated }}>
            {children}
        </auth_context.Provider>
    );
}

export {auth_context, auth_provider};
