import { createBrowserRouter } from "react-router-dom";
import App from "../../app/layout/App";
import HomePage from "../../features/home/HomePage";
import EditProfile from "../../features/auth/edit-profile";

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
