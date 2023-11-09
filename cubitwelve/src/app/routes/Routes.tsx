import { Navigate, Outlet, Route, createBrowserRouter,Routes as Router} from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../../features/auth/Login";
import HomePage from "../../features/home/HomePage";

type Props = {};

const PrivateRoutes = () =>{
    const {authenticated} = useContext(AuthContext);
    if (!authenticated) return <Navigate to="/login" replace />;

    return <Outlet/>;
}

const Routes = (props:Props) => {
    const{authenticated} =  useContext(AuthContext);

    return(
        <Router>
            <Route path="/login" element={<Login/>}/>
            <Route element={<PrivateRoutes/>}>
                <Route path="/" element={<HomePage/>}/>
            </Route>
        </Router>

    );
};

export default Routes ;