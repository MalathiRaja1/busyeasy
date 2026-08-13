import { createSlice } from '@reduxjs/toolkit';


const loadCartFromStorage = () => {
  try {
    const data = localStorage.getItem('buyeasy_cart');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
const loadSavedFromStorage = () => {
  try {
    const data = localStorage.getItem('buyeasy_saved_for_later');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveSavedToStorage = (items) => {
  localStorage.setItem('buyeasy_saved_for_later', JSON.stringify(items));
};
const saveCartToStorage = (items) => {
  localStorage.setItem('buyeasy_cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCartFromStorage(),
    savedForLater: loadSavedFromStorage(),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) item.quantity = quantity;
      saveCartToStorage(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveCartToStorage(state.items);
    },
    saveForLater: (state, action) => {
      const id = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        state.items = state.items.filter(i => i.id !== id);
        const alreadySaved = state.savedForLater.find(i => i.id === id);
        if (!alreadySaved) {
          state.savedForLater.push({ ...item, quantity: 1 });
        }
        saveCartToStorage(state.items);
        saveSavedToStorage(state.savedForLater);
      }
    },
    moveToCart: (state, action) => {
      const id = action.payload;
      const item = state.savedForLater.find(i => i.id === id);
      if (item) {
        state.savedForLater = state.savedForLater.filter(i => i.id !== id);
        const existingInCart = state.items.find(i => i.id === id);
        if (existingInCart) {
          existingInCart.quantity += 1;
        } else {
          state.items.push({ ...item, quantity: 1 });
        }
        saveCartToStorage(state.items);
        saveSavedToStorage(state.savedForLater);
      }
    },
    removeFromSaved: (state, action) => {
      state.savedForLater = state.savedForLater.filter(i => i.id !== action.payload);
      saveSavedToStorage(state.savedForLater);
    },
  },
});



export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  saveForLater,
  moveToCart,
  removeFromSaved,
} = cartSlice.actions;

export default cartSlice.reducer;