import { createBrowserRouter } from "react-router-dom";
import App from "../layout/app";
import HomePage from "../../features/home/home.page";
import EditProfile from "../../features/auth/edit.profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />
      },
      {
        path: "/edit-profile",
        element: <EditProfile />
      }
      
    ]
  }
]);
