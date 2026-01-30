import { createSlice } from "@reduxjs/toolkit";

// --- Helpers for LocalStorage ---
const loadCartFromLocalStorage = () => {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem("cartItems");
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error("Failed to load cart from localStorage", err);
    return [];
  }
};

const saveCartToLocalStorage = (items) => {
  try {
    if (typeof window === "undefined") return;
    localStorage.setItem("cartItems", JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save cart to localStorage", err);
  }
};

// --- Initial State ---
const initialState = {
  items: loadCartFromLocalStorage(),
};

// --- Helper ---
const findIndex = (items, id) =>
  items.findIndex((it) => it._id === id || it.id === id);

// --- Slice ---
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      /**
       * payload = {
       *   product, // main product object from backend
       *   qty: 1
       * }
       */
      const { product, qty = 1 } = action.payload;
      const id = product._id || product.id;

      const idx = findIndex(state.items, id);

      if (idx !== -1) {
        // already in cart, increase qty
        state.items[idx].qty += qty;
      } else {
        const image = product?.images?.[0]?.url || "";

        const newItem = {
          _id: id,
          name: product.name,
          price: product.price,
          image: image,
          qty,
        };

        state.items.push(newItem);
      }

      saveCartToLocalStorage(state.items);
    },

    removeFromCart: (state, action) => {
      const { id } = action.payload;
      state.items = state.items.filter(
        (it) => !(it._id === id || it.id === id)
      );
      saveCartToLocalStorage(state.items);
    },

    increaseQty: (state, action) => {
      const { id } = action.payload;
      const idx = findIndex(state.items, id);
      if (idx !== -1) {
        state.items[idx].qty += 1;
        saveCartToLocalStorage(state.items);
      }
    },

    decreaseQty: (state, action) => {
      const { id } = action.payload;
      const idx = findIndex(state.items, id);
      if (idx !== -1) {
        state.items[idx].qty = Math.max(1, state.items[idx].qty - 1);
        saveCartToLocalStorage(state.items);
      }
    },

    setQty: (state, action) => {
      const { id, qty } = action.payload;
      const idx = findIndex(state.items, id);
      if (idx !== -1) {
        state.items[idx].qty = Math.max(1, Number(qty) || 1);
        saveCartToLocalStorage(state.items);
      }
    },

    clearCart: (state) => {
      state.items = [];
      if (typeof window !== "undefined") localStorage.removeItem("cartItems");
    },

    setCart: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      saveCartToLocalStorage(state.items);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  setQty,
  clearCart,
  setCart,
} = cartSlice.actions;

// --- Selectors ---
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((sum, it) => sum + (it.qty || 0), 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce(
    (sum, it) => sum + (it.price || 0) * (it.qty || 1),
    0
  );

export default cartSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// const loadCartFromLocalStorage = () => {
//   try {
//     if (typeof window === "undefined") return [];
//     const raw = localStorage.getItem("cartItems");
//     return raw ? JSON.parse(raw) : [];
//   } catch (err) {
//     console.error("Failed to load cart from localStorage", err);
//     return [];
//   }
// };

// const saveCartToLocalStorage = (items) => {
//   try {
//     if (typeof window === "undefined") return;
//     localStorage.setItem("cartItems", JSON.stringify(items));
//   } catch (err) {
//     console.error("Failed to save cart to localStorage", err);
//   }
// };

// const initialState = {
//   items: loadCartFromLocalStorage(), // array of product objects with qty
// };

// const findIndex = (items, id) =>
//   items.findIndex((it) => it._id === id || it.id === id);

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       // payload = product object (from backend). Should contain _id, name, price, images[], etc.
//       const product = action.payload;
//       const id = product._id || product.id;
//       const idx = findIndex(state.items, id);

//       if (idx !== -1) {
//         // If already in cart, increase qty
//         state.items[idx].qty = (state.items[idx].qty || 1) + (product.qty || 1);
//       } else {
//         // Add new item with qty default 1
//         state.items.push({ ...product, qty: product.qty || 1 });
//       }

//       saveCartToLocalStorage(state.items);
//     },

//     removeFromCart: (state, action) => {
//       // payload = id (string)
//       const id = action.payload;
//       state.items = state.items.filter((it) => !(it._id === id || it.id === id));
//       saveCartToLocalStorage(state.items);
//     },

//     increaseQty: (state, action) => {
//       const id = action.payload;
//       const idx = findIndex(state.items, id);
//       if (idx !== -1) {
//         state.items[idx].qty = (state.items[idx].qty || 1) + 1;
//         saveCartToLocalStorage(state.items);
//       }
//     },

//     decreaseQty: (state, action) => {
//       const id = action.payload;
//       const idx = findIndex(state.items, id);
//       if (idx !== -1) {
//         state.items[idx].qty = Math.max(1, (state.items[idx].qty || 1) - 1);
//         saveCartToLocalStorage(state.items);
//       }
//     },

//     setQty: (state, action) => {
//       // payload = { id, qty }
//       const { id, qty } = action.payload;
//       const idx = findIndex(state.items, id);
//       if (idx !== -1) {
//         state.items[idx].qty = Math.max(1, Number(qty) || 1);
//         saveCartToLocalStorage(state.items);
//       }
//     },

//     clearCart: (state) => {
//       state.items = [];
//       try {
//         if (typeof window !== "undefined") localStorage.removeItem("cartItems");
//       } catch (err) {
//         console.error(err);
//       }
//     },

//     setCart: (state, action) => {
//       state.items = Array.isArray(action.payload) ? action.payload : [];
//       saveCartToLocalStorage(state.items);
//     },
//   },
// });

// export const {
//   addToCart,
//   removeFromCart,
//   increaseQty,
//   decreaseQty,
//   setQty,
//   clearCart,
//   setCart,
// } = cartSlice.actions;

// export const selectCartItems = (state) => state.cart.items;
// export const selectCartCount = (state) =>
//   state.cart.items.reduce((sum, it) => sum + (it.qty || 0), 0);
// export const selectCartSubtotal = (state) =>
//   state.cart.items.reduce((sum, it) => sum + (it.price || 0) * (it.qty || 1), 0);

// export default cartSlice.reducer;
