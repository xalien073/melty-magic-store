// app/page.js

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
import SessionProviderWrapper from "./components/SessionProviderWrapper"; // Import the wrapper

export default function Products() {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchInventory = async () => {
    try {
      const response = await fetch("/api/get-inventory");
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
          productImage
        }),
      });
d
      if (response.ok) {
        console.log(`${productName} added to cart successfully.`);
        alert('Added Chocolate!');
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

    fetchInventory(); // Fetch on initial render

    const ws = new WebSocket("ws://localhost:8080"); // Replace with your actual WebSocket URL

    ws.onopen = () => {
      console.log("Connected to WebSocket");
    };

    ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data);

        // Iterate through the events received from the server
        data.forEach((event) => {
          const { eventType, data: productData } = event;

          // Handle ProductCreated events
          if (eventType === "ProductCreated") {
            setProducts((prevProducts) => {
              // Check if the product already exists
              const existingProduct = prevProducts.find(
                (p) => p.name === productData.name
              );
              if (existingProduct) return prevProducts; // Avoid duplicate entries
              return [...prevProducts, productData]; // Add new product
            });
          }

          // Handle ProductUpdated events
          if (eventType === "ProductUpdated") {
            setProducts((prevProducts) =>
              prevProducts.map(
                (product) =>
                  product.name === productData.name
                    ? {
                        ...product,
                        price: productData.price,
                        quantityAvailable: productData.quantityAvailable,
                      } // Update the product
                    : product // Keep other products unchanged
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

    // Cleanup WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  return (
    // <SessionProviderWrapper>
    <>
      <Navbar login={ loginFromNav } logout={ () => setUser(null) } />
      <hr></hr>
<h1>
  {user ? `Welcome, ${user.email}` : "Not Logged In"}
</h1>

      <Container>
        <Typography variant="h4" gutterBottom>
          Melty Magic: Where Every Bite Brings Sweet Enchantment!
        </Typography>
        <Grid container spacing={4}>
          {products.map((product) => (
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
                  <Typography variant="h6">
                    Quantity: {product.quantityAvailable}
                  </Typography>
                  {user ? (
                    product.quantityAvailable > 0 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => addToCart(product.name, product.price, product.imageUrl)}
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
    // </SessionProviderWrapper>
  );
}

// app/page.js

// "use client";

// import styles from "./page.module.css";
// import { useState, useEffect } from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   CardMedia,
//   Typography,
//   Button,
//   Container,
// } from "@mui/material";
// import Navbar from "./components/Navbar";

// export default function Products() {
//   const [products, setProducts] = useState([]);

//   const fetchInventory = async () => {
//     try {
//       const response = await fetch("/api/get-inventory");
//       const data = await response.json();
//       if (response.ok) {
//         setProducts(data.inventory);
//       } else {
//         console.error("Error fetching inventory:", data.error);
//       }
//     } catch (error) {
//       console.error("Failed to fetch inventory:", error);
//     }
//   };

//   const addToCart = async (productName, price) => {
//     try {
//       const response = await fetch("/api/add-to-cart", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           productName,
//           price,
//         }),
//       });

//       if (response.ok) {
//         console.log(`${productName} added to cart successfully.`);
//       } else {
//         console.error("Error adding product to cart:", await response.text());
//       }
//     } catch (error) {
//       console.error("Failed to add product to cart:", error);
//     }
//   };

//   useEffect(() => {
//     fetchInventory(); // Fetch on initial render

//     const ws = new WebSocket("ws://localhost:8080"); // Replace with your actual WebSocket URL

//     ws.onopen = () => {
//       console.log("Connected to WebSocket");
//     };

//     ws.onmessage = (message) => {
//       try {
//         const data = JSON.parse(message.data);

//         // Iterate through the events received from the server
//         data.forEach((event) => {
//           const { eventType, data: productData } = event;

//           // Handle ProductCreated events
//           if (eventType === "ProductCreated") {
//             setProducts((prevProducts) => {
//               // Check if the product already exists
//               const existingProduct = prevProducts.find(
//                 (p) => p.name === productData.name
//               );
//               if (existingProduct) return prevProducts; // Avoid duplicate entries
//               return [...prevProducts, productData]; // Add new product
//             });
//           }

//           // Handle ProductUpdated events
//           if (eventType === "ProductUpdated") {
//             setProducts((prevProducts) =>
//               prevProducts.map(
//                 (product) =>
//                   product.name === productData.name
//                     ? {
//                         ...product,
//                         price: productData.price,
//                         quantityAvailable: productData.quantityAvailable,
//                       } // Update the product
//                     : product // Keep other products unchanged
//               )
//             );
//           }
//         });
//       } catch (error) {
//         console.error("Error parsing WebSocket message:", error);
//       }
//     };

//     ws.onerror = (error) => {
//       console.error("WebSocket error:", error);
//     };

//     ws.onclose = () => {
//       console.log("WebSocket connection closed");
//     };

//     // Cleanup WebSocket connection on component unmount
//     return () => {
//       ws.close();
//     };
//   }, []);

//   return (
//     <>
//     <Navbar />
//     <Container>

//       <Grid container spacing={4}>
//         {products.map((product) => (
//           <Grid item xs={12} sm={6} md={4} key={product.name}>
//             <Card>
//               <CardMedia
//                 component="img"
//                 height="200" // Set the desired height
//                 image={product.imageUrl}
//                 alt={product.name} // Alt text for accessibility
//               />
//               <CardContent>
//                 <Typography variant="h6">{product.name}</Typography>
//                 <Typography variant="h6">Price: ${product.price}</Typography>
//                 <Typography variant="h6">
//                   Quantity: {product.quantityAvailable}
//                 </Typography>
//                 {product.quantityAvailable > 0 ? (
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => addToCart(product.name, product.price)}
//                   >
//                     Add to Cart
//                   </Button>
//                 ) : (
//                   <Typography variant="body1" color="error">
//                     Out of Stock!
//                   </Typography>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//     </Container>
//     </>
//   );
// }
