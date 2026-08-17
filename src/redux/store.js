import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import wishlistReducer from './wishlistSlice';
import recentlyViewedReducer from './recentlyViewedSlice';
import themeReducer from './themeSlice';


export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    recentlyViewed: recentlyViewedReducer,
    theme: themeReducer,
  },
});