import { useEffect, useState } from "react";
import Navigation from "./components/Navigation";
import CartDisplay from "./pages/CartDisplay";
import Checkout from "./pages/Checkout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Item, User } from "./type";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

interface UserResponse {
  user: User;
}

interface CartResponse {
  cart: Item[];
}

async function getUser() {
  const response = await fetch("http://localhost/api/user");
  if (response.ok) {
    console.log("response from getUser");
    console.log(response);
    return response.json();
  } else {
    throw new Error("Login failed");
  }
}

async function getCart() {
  const response = await fetch("http://localhost/api/cart");
  if (response.ok) {
    console.log("response from getCart");
    console.log(response);
    return response.json();
  } else {
    throw new Error("Login failed");
  }
}

function App() {
  const initialCart: Item[] = [];
  const [cart, setCart] = useState(initialCart);
  const [user, setUser] = useState("");

  async function setCartBulkRequest(cart: Item[]) {
    setCart(cart);
    const response = await fetch("http://localhost/api/cart/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart,
      }),
    });
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Setting cart failed");
    }
  }

  // May want to move this out of here.
  useEffect(() => {
    getUser()
      .then((response: UserResponse) => {
        setUser(response.user.name);
      })
      .catch((error) => {
        console.log("Error fetching current user");
        console.log(error);
      });
    console.log(user);


    getCart().then((response: CartResponse) => {
      setCart(response.cart);
    }).catch((error) => {
      console.log("Error fetching cart");
      console.log(error);
    });
    console.log(cart);
  }, [user]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navigation cart={cart} user={user} setUser={setUser} />
        <div>
          <Routes>
            <Route
              path="/"
              element={<Dashboard cart={cart} setCart={setCartBulkRequest} />}
            />
            <Route
              path="/cart"
              element={<CartDisplay cart={cart} setCart={setCartBulkRequest} />}
            />
            <Route path="/checkout" element={<Checkout cart={cart} setCart={setCartBulkRequest}/>} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
