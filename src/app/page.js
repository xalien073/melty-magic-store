"use client"; // Mark this as a client component

import styles from "./page.module.css";
import { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Container,
} from "@mui/material";
import Navbar from "./components/Navbar";

export default function Products() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState(""); // Track the new product name
  const [newProductAlert, setNewProductAlert] = useState(false); // Boolean for new product alert

  const fetchInventory = async () => {
    try {
      const timestamp = new Date().getTime(); // Add timestamp to prevent caching
      const response = await fetch(`/api/get-inventory?timestamp=${timestamp}`);
      const data = await response.json();
      if (response.ok) {
        setProducts(data.inventory);
      } else {
        console.error("Error fetching inventory:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    }
  };

  const addToCart = async (productName, productPrice, productImage) => {
    try {
      const response = await fetch("/api/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: user.email,
          productName,
          productPrice,
          productImage,
        }),
      });

      if (response.ok) {
        console.log(`${productName} added to cart successfully.`);
        alert("Added chocolate to cart!");
      } else {
        console.error("Error adding product to cart:", await response.text());
      }
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const loginFromNav = (u) => {
    setUser(u);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("UserMeltyMagic");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchInventory();

    const ws = new WebSocket("wss://melty-magic-inventory-pulse.azurewebsites.net");
    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);

        data.forEach((event) => {
          const { eventType, data: productData } = event;

          if (eventType === "ProductCreated") {
            setProducts((prevProducts) => {
              const existingProduct = prevProducts.find(
                (p) => p.name === productData.name
              );
              if (existingProduct) return prevProducts;
              return [...prevProducts, productData];
            });
            const audio = new Audio("/notify.mp3");
            audio.play();

            setNewProductName(productData.name);
            setNewProductAlert(true);
            setTimeout(() => setNewProductAlert(false), 9000);
          }

          if (eventType === "ProductUpdated") {
            setProducts((prevProducts) =>
              prevProducts.map((product) =>
                product.name === productData.name
                  ? {
                      ...product,
                      price: productData.price,
                      quantityAvailable: productData.quantityAvailable,
                    }
                  : product
              )
            );
          }
        });
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <>
      <div className={styles.backgroundVideo}>
        <video autoPlay loop muted>
          <source src="/chocolates.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <Navbar
        login={loginFromNav}
        logout={() => setUser(null)}
        newProductAlert={newProductAlert}
        newProductName={newProductName}
      />
      <Container>
      <Typography 
  variant="h4" 
  gutterBottom 
  style={{ color: 'white' }}
>
  Melty Magic: Where Every Bite Brings Sweet Enchantment!
</Typography>

        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.name}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl}
                  alt={product.name}
                />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="h6">Price: ${product.price}</Typography>
                  <Typography variant="h6">
                    Quantity: {product.quantityAvailable}
                  </Typography>
                  {user ? (
                    product.quantityAvailable > 0 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          addToCart(product.name, product.price, product.imageUrl)
                        }
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <Typography variant="body1" color="error">
                        Out of Stock!
                      </Typography>
                    )
                  ) : (
                    <Typography variant="body1" color="textSecondary">
                      Please log in to start shopping!
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
