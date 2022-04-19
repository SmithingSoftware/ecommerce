import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Item } from "../type";

export interface ProductProps {
  setCart: (items: Item[]) => Promise<any>;
  cart: Item[];
  item: Item;
}

interface State {
  addedToCart: boolean;
  quantity: number;
}

export class Product extends React.Component<ProductProps, State> {
  static defaultState = {
    addedToCart: false,
    quantity: 1,
  };

  constructor(props: ProductProps) {
    super(props);
    this.state = Product.defaultState;
  }

  static defaultProps = {
    price: "999.99",
    name: "Test item",
    image: "/images/backpack.jpg",
    description: "A cool backpack.",
  };

  handleAddItem = (event: React.MouseEvent) => {
    event.preventDefault();
    const { item, cart, setCart } = this.props;
    var items: Item[] = [];
    for (var i = 0; i < this.state.quantity; i++) {
      items.push(item);
    }
    setCart(cart.concat(items));
    this.setState({ addedToCart: true });
  };

  handleDecreaseQuantity = (event: React.MouseEvent) => {
    event.preventDefault();
    var { quantity } = this.state;
    if (quantity > 1) {
      this.setState({ quantity: quantity - 1 });
    }
  };

  handleIncreaseQuantity = (event: React.MouseEvent) => {
    event.preventDefault();
    var { quantity } = this.state;
    this.setState({ quantity: quantity + 1 });
  };

  render() {
    const { item } = this.props;
    let { quantity } = this.state;
    return (
      <Card sx={{ maxWidth: 500 }}>
        <CardMedia
          component="img"
          height="250"
          image={item.image}
          alt={item.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {item.name}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            ${item.price}
          </Typography>
        </CardContent>
        <CardActions>
          {this.state.addedToCart ? (
            <Typography sx={{ pb: 1 }}>Added to Cart</Typography>
          ) : (
            <Box sx={{ display: "inline" }}>
              <Button
                size="small"
                variant="contained"
                sx={{ mr: 5 }}
                onClick={this.handleAddItem}
              >
                Add to Cart
              </Button>
              <Box sx={{ display: "inline-flex" }}>
                <Button size="small" onClick={this.handleDecreaseQuantity}>
                  -
                </Button>
                <Typography sx={{ p: 1 }}>{quantity}</Typography>
                <Button size="small" onClick={this.handleIncreaseQuantity}>
                  +
                </Button>
              </Box>
            </Box>
          )}
        </CardActions>
      </Card>
    );
  }
}
