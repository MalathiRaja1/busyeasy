import { createSlice } from '@reduxjs/toolkit';

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem('buyeasy_recently_viewed');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (items) => {
  localStorage.setItem('buyeasy_recently_viewed', JSON.stringify(items));
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState: {
    items: loadFromStorage(),
  },
  reducers: {
    addRecentlyViewed: (state, action) => {
      const product = action.payload;
      state.items = state.items.filter(p => p.id !== product.id);
      state.items.unshift(product);
      state.items = state.items.slice(0, 10); // keep last 10
      saveToStorage(state.items);
    },
  },
});

export const { addRecentlyViewed } = recentlyViewedSlice.actions;
export default recentlyViewedSlice.reducer;