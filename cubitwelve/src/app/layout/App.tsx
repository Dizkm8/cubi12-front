import { CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";

const App = () => {
  return (
    <>
      <CssBaseline/>
      <Outlet/>
    </>
  );
}

export default App;
