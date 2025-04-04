// app/store/cartSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async function to fetch cart data
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userEmail) => {
  try {
    const timestamp = new Date().getTime();
    const response = await fetch(`/api/get-cart?user=${userEmail}&timestamp=${timestamp}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error("Error fetching cart!");
    }
    return data.cart;
  } catch (error) {
    console.error("Failed to fetch cart:", error);
    throw error;
  }
});

// Async function to update product quantity in the cart
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userEmail, productName, quantity }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/update-product-quantity`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, productName, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      return { productName, quantity };
    } catch (error) {
      console.error("Error updating quantity:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Async function to remove a product from the cart
export const removeProductFromCart = createAsyncThunk(
  "cart/removeProductFromCart",
  async ({ userEmail, productName }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/remove-from-cart`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, productName }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove product");
      }

      return productName;
    } catch (error) {
      console.error("Error removing product:", error);
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    user: null,
    cart: [],
    status: "idle", // "idle" | "loading" | "failed"
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "idle";
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Update quantity (calls API)
      .addCase(updateCartQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        state.status = "idle";
        const { productName, quantity } = action.payload;
        const product = state.cart.find((item) => item.name === productName);
        if (product) {
          product.quantity = quantity;
        }
      })
      .addCase(updateCartQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Remove product (calls API)
      .addCase(removeProductFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.status = "idle";
        state.cart = state.cart.filter((product) => product.name !== action.payload);
      })
      .addCase(removeProductFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUser } = cartSlice.actions;
export default cartSlice.reducer;



// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // Async function to fetch cart data
// export const fetchCart = createAsyncThunk("cart/fetchCart", async (userEmail) => {
//   try {
//     const timestamp = new Date().getTime();
//     const response = await fetch(`/api/get-cart?user=${userEmail}&timestamp=${timestamp}`);
//     const data = await response.json();
//     if (response.ok) {
//       return data.cart;
//     } else {
//       throw new Error("Error fetching cart!");
//     }
//   } catch (error) {
//     console.error("Failed to fetch cart:", error);
//     throw error;
//   }
// });

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     user: null,
//     cart: [],
//     status: "idle", // "idle" | "loading" | "failed"
//   },
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//     },

//     // Update product quantity
//     updateQuantity: (state, action) => {
//       const { productId, quantity } = action.payload;
//       const product = state.cart.find((item) => item.id === productId);
//       if (product) {
//         product.quantity = quantity;
//       }
//     },

//     // Remove product if quantity becomes 0
//     removeFromCart: (state, action) => {
//       state.cart = state.cart.filter((product) => product.id !== action.payload);
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchCart.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchCart.fulfilled, (state, action) => {
//         state.status = "idle";
//         state.cart = action.payload;
//       })
//       .addCase(fetchCart.rejected, (state) => {
//         state.status = "failed";
//       });
//   },
// });

// export const { setUser, updateQuantity, removeFromCart } = cartSlice.actions;
// export default cartSlice.reducer;



// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// // // Async function to fetch cart data
// // export const fetchCart = createAsyncThunk("cart/fetchCart", async (userEmail) => {
// //   try {
// //     const timestamp = new Date().getTime();
// //     const response = await fetch(`/api/get-cart?user=${userEmail}&timestamp=${timestamp}`);
// //     const data = await response.json();
// //     if (response.ok) {
// //       return data.cart;
// //     } else {
// //       throw new Error("Error fetching cart!");
// //     }
// //   } catch (error) {
// //     console.error("Failed to fetch cart:", error);
// //     throw error;
// //   }
// // });

// // const cartSlice = createSlice({
// //   name: "cart",
// //   initialState: {
// //     user: null,
// //     cart: [],
// //     status: "idle", // "idle" | "loading" | "failed"
// //   },
// //   reducers: {
// //     setUser: (state, action) => {
// //       state.user = action.payload;
// //     },
// //     removeFromCart: (state, action) => {
// //       state.cart = state.cart.filter((product) => product.id !== action.payload);
// //     },
// //   },
// //   extraReducers: (builder) => {
// //     builder
// //       .addCase(fetchCart.pending, (state) => {
// //         state.status = "loading";
// //       })
// //       .addCase(fetchCart.fulfilled, (state, action) => {
// //         state.status = "idle";
// //         state.cart = action.payload;
// //       })
// //       .addCase(fetchCart.rejected, (state) => {
// //         state.status = "failed";
// //       });
// //   },
// // });

// // export const { setUser, removeFromCart } = cartSlice.actions;
// // export default cartSlice.reducer;
