import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
// @ts-ignore
import Cubi12Logo from "../static/images/cubi12.svg";
import { primaryBlueColor, primaryRedColor } from "../static/colors";
import { Link } from 'react-router-dom';
import { useContext, useEffect, useState, MouseEvent } from "react";
import { AuthContext } from "../context/AuthContext";
import Agent from "../api/agent";

const Navbar = () => {

  const [loggedName, setLoggedName] = useState("");

  const { authenticated, setAuthenticated } = useContext(AuthContext);

  const pages = authenticated ? ["Inicio", "Malla Interactiva", "Mi Progreso"] : ["Inicio", "Malla Interactiva"];
  const settings = authenticated ? [loggedName, "Mis datos", "Cerrar Sesión"] : ["Invitado", "Iniciar Sesión"];

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    Agent.token = "";
    localStorage.removeItem("token");
    setAuthenticated(false);
    handleCloseUserMenu();
  };
  
  useEffect(() => {
    if (localStorage.getItem("token")) {
      Agent.Auth.profile()
          .then(response => {

            setLoggedName(response.name.split(" ")[0] + " " + response.firstLastName);
          })
          .catch(error => { console.error("Error loading user:", error); });
    }
  }, []);

  return (
    <AppBar position="static" sx={{ backgroundColor: primaryBlueColor }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Avatar
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
            alt="Cubi12 Logo"
            src={Cubi12Logo}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 400,
              color: "inherit",
            }}
          >
            CUBI12
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Avatar
            sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
            alt="Cubi12 Logo"
            src={Cubi12Logo}
          />
          <Box sx={{ flexGrow: 20, display: { xs: "none", md: "flex" } }} />
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }} />
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          {pages.map((page) => (
            <Link 
              key={page}
              style={{ textDecoration: "none", color: "inherit" }}
              to={ page === "Inicio" ? "/" : page === "Malla Interactiva" ? "/interactive-mesh" : "/my-progress" }
            >
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handleCloseNavMenu}
              >
                {page}
              </Button>
            </Link>
          ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={""} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            {settings.map((setting) => (
              <Link
                key={setting}
                style={{ textDecoration: "none", color: setting === 'Invitado' ? 'gray' : 'inherit', }}
                to={setting === "Iniciar Sesión" ? "/login" : setting === "Mis datos" ? "/edit-profile" : setting === "Cerrar Sesión" ? "/" : "#"}
                onClick={() => { if (setting === "Cerrar Sesión") { handleLogout() } }}
              >
                <MenuItem key={setting} onClick={handleCloseUserMenu} disabled={setting !== "Iniciar Sesión" && setting !== "Cerrar Sesión" && setting !== "Mis datos"}>
                  <Typography key={setting} style={{ 
                    color: setting === "Cerrar Sesión" ? primaryRedColor : setting === "Mis datos" ? primaryBlueColor : "inherit", 
                    textAlign: 'center' 
                  }}>{setting}</Typography>
                </MenuItem>
              </Link>
            ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
