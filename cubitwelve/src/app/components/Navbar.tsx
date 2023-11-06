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
import { primary_blue_color } from "../static/colors";
import { Link } from 'react-router-dom';

const pages = ["Inicio", "Malla Interactiva", "Mi Progreso"];
const settings = ["Mi Perfil", "Cerrar Sesión"];

const Navbar = () => {
  const [anchor_el_nav, set_anchor_el_nav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchor_el_user, set_anchor_el_user] = React.useState<null | HTMLElement>(
    null
  );

  const handle_open_nav_menu = (event: React.MouseEvent<HTMLElement>) => {
    set_anchor_el_nav(event.currentTarget);
  };
  const handle_open_user_menu = (event: React.MouseEvent<HTMLElement>) => {
    set_anchor_el_user(event.currentTarget);
  };

  const handle_close_nav_menu = () => {
    set_anchor_el_nav(null);
  };

  const handle_close_user_menu = () => {
    set_anchor_el_user(null);
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: primary_blue_color }}>
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
              onClick={handle_open_nav_menu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchor_el_nav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchor_el_nav)}
              onClose={handle_close_nav_menu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handle_close_nav_menu}>
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
              to={page === "Inicio" ? "/" : page === "Malla Interactiva" ? "interactive-mesh" : "my-progress"}
            >
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                onClick={handle_close_nav_menu}
              >
                {page}
              </Button>
            </Link>
          ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handle_open_user_menu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src={""} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchor_el_user}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchor_el_user)}
              onClose={handle_close_user_menu}
            >
            {settings.map((setting) => (
              <Link
                key={setting}
                style={{ textDecoration: "none", color: "inherit" }}
                to={setting === "Mi Perfil" ? "/edit-profile" : "/logout"}
              >
                <MenuItem key={setting} onClick={handle_close_user_menu}>
                  <Typography key={setting} textAlign="center">{setting}</Typography>
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
