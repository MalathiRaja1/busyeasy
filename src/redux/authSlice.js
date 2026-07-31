import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const getRoleFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded[Object.keys(decoded).find(k => k.includes('role'))] || null;
  } catch {
    return null;
  }
};

const loadAuthFromStorage = () => {
  try {
    const data = localStorage.getItem('buyeasy_auth');
    if (!data) return { token: null, email: null, fullName: null, role: null };
    const parsed = JSON.parse(data);
    const role = parsed.token ? getRoleFromToken(parsed.token) : null;
    return { ...parsed, role };
  } catch {
    return { token: null, email: null, fullName: null, role: null };
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthFromStorage(),
  reducers: {
    setAuth: (state, action) => {
      const { token, email, fullName } = action.payload;
      const role = getRoleFromToken(token);
      state.token = token;
      state.email = email;
      state.fullName = fullName;
      state.role = role;
      localStorage.setItem('buyeasy_auth', JSON.stringify({ token, email, fullName }));
    },
    logout: (state) => {
      state.token = null;
      state.email = null;
      state.fullName = null;
      state.role = null;
      localStorage.removeItem('buyeasy_auth');
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;