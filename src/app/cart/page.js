// app/cart/page.js

"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, setUser, updateQuantity, removeFromCart } from "../store/cartSlice";
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
  const dispatch = useDispatch();
  const { user, cart, status } = useSelector((state) => state.cart);

  // Set user and fetch cart
  const loginFromNav = (u) => {
    dispatch(setUser(u));
    dispatch(fetchCart(u.email));
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("UserMeltyMagic");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      dispatch(setUser(userData));
      dispatch(fetchCart(userData.email));
    }
  }, [dispatch]);

  // Function to update quantity
  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: productId, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  return (
    <>
      <Navbar login={loginFromNav} logout={() => dispatch(setUser(null))} />
      <hr />
      <Container>
        <Typography variant="h4" gutterBottom>
          My Cart
        </Typography>

        {status === "loading" && <Typography>Loading cart...</Typography>}
        {status === "failed" && <Typography>Error loading cart.</Typography>}

        {cart.length > 0 && status === "idle" && (
          <>
            <strong style={{ margin: "20px", fontSize: "32px" }}>
              Cart Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
            </strong>

            <Button variant="contained" color="primary" style={{ margin: "0 0 20px 600px" }}>
              Place Order
            </Button>
          </>
        )}

        <Grid container spacing={4}>
          {cart.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card>
                <CardMedia component="img" height="200" image={product.imageUrl} alt={product.name} />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography variant="h6">Price: ${product.price}</Typography>

                  {/* Quantity controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
                    >
                      -
                    </Button>

                    <Typography variant="h6">{product.quantity}</Typography>

                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleUpdateQuantity(product.id, 0)}
                    style={{ marginTop: "10px" }}
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

// "use client";

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCart, setUser, updateQuantity, removeFromCart } from "../store/cartSlice";
// import {
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
// } from "@mui/material";
// import Navbar from "../components/Navbar";

// export default function Cart() {
//   const dispatch = useDispatch();
//   const { user, cart, status } = useSelector((state) => state.cart);

//   // Set user and fetch cart
//   const loginFromNav = (u) => {
//     dispatch(setUser(u));
//     dispatch(fetchCart(u.email));
//   };
  
//   useEffect(() => {
//     const storedUser = localStorage.getItem("UserMeltyMagic");
//     if (storedUser) {
//       const userData = JSON.parse(storedUser);
//       dispatch(setUser(userData));
//       dispatch(fetchCart(userData.email));
//     }
//   }, [dispatch]);

//   return (
//     <>
//       <Navbar login={loginFromNav} logout={() => dispatch(setUser(null))} />
//       <hr />
//       <Container>
//         <Typography variant="h4" gutterBottom>
//           My Cart
//         </Typography>

//         {status === "loading" && <Typography>Loading cart...</Typography>}
//         {status === "failed" && <Typography>Error loading cart.</Typography>}

//         {cart.length > 0 && status === "idle" && (
//           <>
//             <strong style={{ margin: "20px", fontSize: "32px" }}>
//               Cart Total: ${cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}
//             </strong>

//             <Button variant="contained" color="primary" style={{ margin: "0 0 20px 600px" }}>
//               Place Order
//             </Button>
//           </>
//         )}

//         <Grid container spacing={4}>
//           {cart.map((product) => (
//             <Grid item xs={12} sm={6} md={4} key={product.id}>
//               <Card>
//                 <CardMedia component="img" height="200" image={product.imageUrl} alt={product.name} />
//                 <CardContent>
//                   <Typography variant="h6">{product.name}</Typography>
//                   <Typography variant="h6">Price: ${product.price}</Typography>

//                   {/* Quantity controls */}
//                   <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
//                     <Button
//                       variant="outlined"
//                       color="secondary"
//                       onClick={() => handleUpdateQuantity(product.id, product.quantity - 1)}
//                     >
//                       -
//                     </Button>

//                     <Typography variant="h6">{product.quantity}</Typography>

//                     <Button
//                       variant="outlined"
//                       color="primary"
//                       onClick={() => handleUpdateQuantity(product.id, product.quantity + 1)}
//                     >
//                       +
//                     </Button>
//                   </div>

//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={() => handleUpdateQuantity(product.id, 0)}
//                     style={{ marginTop: "10px" }}
//                   >
//                     Remove
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>
//     </>
//   );
// }
