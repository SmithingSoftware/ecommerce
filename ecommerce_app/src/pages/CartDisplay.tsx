import {
  Box,
  Button,
  Card,
  CardMedia,
  Typography,
  CardContent,
  CardActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Item } from "../type";

interface CartDisplayItemProps {
  item: Item;
  quantity: number;
  cart: Item[];
  setCart: (items: Item[]) => Promise<any>;
  cartQuantities: Map<string, number>;
  increaseQuantity: (
    id: string,
    cart: Item[],
    setCart: (items: Item[]) => Promise<any>
  ) => void;
  decreaseQuantity: (
    id: string,
    cart: Item[],
    setCart: (items: Item[]) => Promise<any>
  ) => void;
}

function CartDisplayItem(props: CartDisplayItemProps) {
  const {
    item,
    cart,
    setCart,
    quantity,
    increaseQuantity,
    decreaseQuantity,
  } = props;
  return (
    <Card
      sx={{
        maxHeight: "140px",
        m: 2,
        display: "flex",
        alignContent: "space-between",
      }}
    >
      <CardMedia component="img" sx={{ width: 130, p: 2 }} image={item.image} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {item.name}
        </Typography>
        <Typography component="div">{item.description}</Typography>
        <Typography variant="h6" color="text.secondary">
          ${item.price}
        </Typography>
      </CardContent>
      <CardActions>
        <Box sx={{ display: "inline-flex" }}>
          <Button
            size="small"
            onClick={() => decreaseQuantity(item.id, cart, setCart)}
          >
            -
          </Button>
          <Typography>{quantity}</Typography>
          <Button
            size="small"
            onClick={() => increaseQuantity(item.id, cart, setCart)}
          >
            +
          </Button>
          <Button
            size="small"
            onClick={() => removeFromCart(item, cart, setCart)}
          >
            Remove from Cart
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
}

interface CartDisplayProps {
  cart: Item[];
  setCart: (items: Item[]) => Promise<any>;
}

function removeFromCart(
  item: Item,
  cart: Item[],
  setCart: (items: Item[]) => Promise<any>
) {
  setCart(cart.filter((cartItem) => cartItem.id !== item.id));
}

function collectCartQuantities(cart: Item[]): Map<string, number> {
  var quantities = new Map<string, number>();
  for (var i = 0; i < cart.length; i++) {
    let val = quantities.get(cart[i].id);
    if (val != null) {
      quantities.set(cart[i].id, val + 1);
    } else {
      quantities.set(cart[i].id, 1);
    }
  }

  return quantities;
}

function increaseQuantity(
  id: string,
  cart: Item[],
  setCart: (items: Item[]) => Promise<any>
) {
  let item = cart.filter((value) => value.id === id).pop();
  if (item == null) {
    return;
  }
  setCart(cart.concat(item));
  console.log("Added item with item ID " + item.id + " to cart");
}

function decreaseQuantity(
  id: string,
  cart: Item[],
  setCart: (items: Item[]) => Promise<any>
) {
  const index = cart.findIndex((value) => value.id === id);
  if (index === -1) {
    return;
  }
  let left = cart.slice(0, index);
  let right = cart.slice(index + 1);
  setCart([...left, ...right]);
  console.log("Removed item with item ID " + id + " from cart");
}

export default function CartDisplay(props: CartDisplayProps) {
  const { cart, setCart } = props;
  var subtotal = 0;
  for (var i = 0; i < cart.length; i++) {
    subtotal += Number(cart[i].price);
  }

  const taxRate = 0.08;
  var totalTax = (subtotal * taxRate).toFixed(2);
  var totalPrice = (subtotal + Number(totalTax)).toFixed(2);
  var cartQuantities = collectCartQuantities(cart);
  return cart.length !== 0 ? (
    <Box
      sx={{ display: "flex", flexWrap: "wrap", alignContent: "space-between" }}
    >
      <Box
        sx={{
          width: "1000px",
          display: "grid",
          gridTemplateRows: "repeat(3, 1fr)",
        }}
      >
        {Array.from(cartQuantities.entries()).map(([id, quantity]) => {
          let item = cart.find((value) => value.id === id);
          if (item != null) {
            return (
              <CartDisplayItem
                item={item}
                key={item.id}
                quantity={quantity}
                cart={cart}
                setCart={setCart}
                cartQuantities={cartQuantities}
                increaseQuantity={increaseQuantity}
                decreaseQuantity={decreaseQuantity}
              />
            );
          }
          return null;
        })}
      </Box>
      <Box sx={{ width: "500px", p: 2 }}>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Your Cart
            </Typography>
            <Typography sx={{ display: "flex" }} component="div">
              Subtotal:{" "}
              <Box sx={{ fontWeight: "bold", pl: 2 }}>
                ${subtotal.toFixed(2)}
              </Box>
            </Typography>
            <Typography sx={{ display: "flex" }} component="div">
              {/* TODO: This should handle tax rates. */}
              Tax: <Box sx={{ fontWeight: "bold", pl: 2 }}>${totalTax}</Box>
            </Typography>
            <Typography
              sx={{ display: "flex" }}
              component="div"
              variant="h6"
              color="text.secondary"
            >
              Total Price:{" "}
              <Box sx={{ fontWeight: "bold", pl: 2 }}>${totalPrice}</Box>
            </Typography>
          </CardContent>
          <CardActions>
            <Link to="/checkout">
              <Button>Proceed to Checkout</Button>
            </Link>
          </CardActions>
        </Card>
      </Box>
    </Box>
  ) : (
    <Box sx={{ m: 5 }}>
      <Typography variant="h4">
        Looks like there's nothing in your cart.
      </Typography>
    </Box>
  );
}
