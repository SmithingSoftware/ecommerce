import {
  Box,
  Button,
  Card,
  CardActions,
  Divider,
  TextField,
  Typography,
  CardContent,
} from "@mui/material";
import { Item } from "../type";

interface CheckoutProps {
  cart: Item[];
  setCart: (items: Item[]) => Promise<any>;
}

interface ShippingDetailsProps {}
interface BillingDetailsProps {}

function ShippingDetails(props: ShippingDetailsProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Shipping Details
      </Typography>
      <TextField
        sx={{ width: "425px", p: 1 }}
        id="standard-basic"
        label="Name"
      />
      <TextField
        sx={{ width: "425px", p: 1 }}
        id="standard-basic"
        label="Address Line 1"
      />
      <TextField
        sx={{ width: "425px", p: 1 }}
        id="standard-basic"
        label="Address Line 2"
      />
      <TextField
        sx={{ width: "212px", p: 1 }}
        id="standard-basic"
        label="Zip Code"
      />
      <TextField
        sx={{ width: "212px", p: 1 }}
        id="standard-basic"
        label="State/Province"
      />
      <br />
      <TextField
        sx={{ width: "425px", p: 1 }}
        id="standard-basic"
        label="Country"
      />
    </Box>
  );
}

function BillingDetails(props: BillingDetailsProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Billing Information
      </Typography>
      <TextField
        sx={{ width: "425px", p: 1 }}
        id="standard-basic"
        label="Name"
      />
      <TextField
        sx={{ width: "425px", p: 1 }}
        id="standard-basic"
        label="Card Number"
      />
      <TextField
        sx={{ width: "425px", p: 1 }}
        id="standard-basic"
        label="Expiration"
      />
      <TextField
        sx={{ width: "425px", p: 1 }}
        id="standard-basic"
        label="Address Line 1"
      />
      <TextField
        sx={{ width: "425px", p: 1 }}
        id="standard-basic"
        label="Address Line 2"
      />
      <TextField
        sx={{ width: "212px", p: 1 }}
        id="standard-basic"
        label="Zip Code"
      />
      <TextField
        sx={{ width: "212px", p: 1 }}
        id="standard-basic"
        label="State/Province"
      />
      <br />
      <TextField
        sx={{ width: "425px", p: 1 }}
        id="standard-basic"
        label="Country"
      />
    </Box>
  );
}

function handleSubmitOrder(props: CheckoutProps) {
  const { setCart } = props;
  // Grab shipping and billing details
  // Create order from cart then clear cart
  alert("Order submitted!");
  setCart([]);
}

export default function Checkout(props: CheckoutProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ maxWidth: "1000px" }}>
        <CardContent>
          <Typography variant="h4">Checkout</Typography>
          <Divider />
          <Box sx={{ display: "flex" }}>
            <ShippingDetails />
            <BillingDetails />
          </Box>
        </CardContent>
        <CardActions sx={{ overflow: "auto" }}>
          <Button
            sx={{ float: "right" }}
            onClick={() => handleSubmitOrder(props)}
          >
            Submit Order
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
