import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { ShoppingCart } from "@mui/icons-material";
import { Item } from "../type";


const SITE_NAME = "Pretty Good Buys";

function cartItemTooltip(items: Item[]) {
  if (items.length === 0) {
    return "Cart is empty";
  } else if (items.length === 1) {
    return "1 item in cart";
  } else {
    return `${items.length} items in cart`;
  }
}

interface NavBarProps {
  cart: Item[];
  user: string;
  setUser: React.Dispatch<React.SetStateAction<string>>;
}

const ResponsiveAppBar = (props: NavBarProps) => {
  const { cart, user, setUser } = props;

  console.log("Loading app bar. User: " + user);

  async function handleLogout(event: React.MouseEvent<Element, MouseEvent>) {
    event.preventDefault();
    console.log("Logging out");
    await fetch("http://localhost/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setUser("");
          alert("You've been logged out.");
          window.location.reload();
        } else {
          throw new Error("Logout failed");
        }
      })
      .catch((error) => {
        console.log("Error");
        console.log(error);
      });
  }

  const location = useLocation();
  const shouldShowLogin = (location.pathname !== "/login")

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Container sx={{ alignContent: "space-between", justifyContent: "space-between", display: "flex"}}>
          <Typography
            variant="h6"
            noWrap
            component="div"
          >
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              {location.pathname === "/" ? SITE_NAME : "Return to Home"}
            </Link>
          </Typography>
          <Box sx={{ marginLeft: "auto", display: "flex", alignItems: "center"}}>
          <Tooltip title={cartItemTooltip(cart)}>
            <Link to="/cart">
              <IconButton>
                <ShoppingCart></ShoppingCart>
                {cart.length > 0 && <span color="orange">{cart.length}</span>}
              </IconButton>
            </Link>
          </Tooltip>
            {user === "" || user == null ? (
              shouldShowLogin ? (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Login
                </Button>
              </Link>) : (
                null
              )
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            )}
            </Box>
          </Container>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
