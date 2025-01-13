// app/cart/page.js

"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import Navbar from "../components/Navbar";

export default function Cart() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);

  // Fetch user's cart
  const fetchCart = async (u) => {
    try {
      const response = await fetch(`/api/get-cart?user=${u.email}`);
      const data = await response.json();
      if (response.ok) {
        setCart(data.cart);
      } else {
        alert("Error fetching cart!");
        console.error("Error fetching cart:", data.error);
      }
    } catch (error) {
      alert("Failure!");
      console.error("Failed to fetch cart:", error);
    }
  };

  // Remove item from the cart
  const handleRemove = async (productId) => {
    try {
      const response = await fetch(`/api/remove-from-cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      if (response.ok) {
        // Update cart state
        setCart(cart.filter((product) => product.id !== productId));
      } else {
        console.error("Error removing item from cart:", data.error);
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  const loginFromNav = (u) => {
    setUser(u);
    fetchCart(u);
  };

  // Fetch cart on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("UserMeltyMagic");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      fetchCart(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      <Navbar login={loginFromNav} logout={() => setUser(null)} />
      <hr></hr>
      <h1>{user ? `Welcome, ${user.email}` : "Not Logged In"}</h1>
      <Container>
        <Typography variant="h4" gutterBottom>
          My Cart
        </Typography>
        {cart.length > 0 && (
          <>
            {/* Calculate and display the cart total */}
            <strong style={{ margin: "20px", fontSize: "32px" }}>
              Cart Total: $
              {cart
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}
            </strong>

            {/* Place Order Button */}
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "0 0 20px 600px" }}
            >
              Place Order
            </Button>
          </>
        )}

        <Grid container spacing={4}>
          {cart.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.name}>
              <Card>
                <CardMedia
                  component="img"
                  height="200" // Set the desired height
                  image={product.imageUrl}
                  alt={product.name} // Alt text for accessibility
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="h6">Price: ${product.price}</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRemove(product.name)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
      </Container>
    </>
  );
}
