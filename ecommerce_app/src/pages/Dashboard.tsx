import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import { useEffect } from "react";
import { Product } from "../components/Product";
import productList from "../data/products.json";
import { Item } from "../type";

interface ProductDisplayProps {
  setCart: (items: Item[]) => Promise<any>;
  cart: Item[];
}

export default function Products(props: ProductDisplayProps) {
  const [products] = React.useState<Array<Item>>(productList);
  useEffect(() => {
    const getProducts = () => {
      fetch("http://localhost/api/products")
        .then((response) => {
          console.log("Got products");
          console.log(response.json());
        })
        .catch((error) => {
          console.log("Error getting products");
          console.log(error);
        });
    };
    getProducts();
  }, []);

  const { cart, setCart } = props;

  return (
    <Box>
      <Typography gutterBottom align="center" variant="h5" component="div">
        All Products
      </Typography>
      <Box sx={{ ml: 5, mr: 5, mb: 5 }}>
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {products.map((product) => (
            <Grid key={product.id} item xs={3}>
              <Product cart={cart} setCart={setCart} item={product}></Product>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
