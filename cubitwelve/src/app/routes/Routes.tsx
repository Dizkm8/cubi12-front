import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import Register from "../../features/auth/Register";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children:[
            {
                path:"",
                element: <Register/>
            }
        ]
    }
])