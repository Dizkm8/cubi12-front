import React from "react";
import ReactDOM from "react-dom";
import App from "./app/layout/App";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router } from 'react-router-dom';


ReactDOM.render(
  <Router>
    <CssBaseline />
    <App />
  </Router>,
  document.getElementById("root")
);
