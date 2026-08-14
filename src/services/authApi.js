import axios from "axios";

//const API_URL = "https://localhost:7117/api/auth";
const API_URL = "https://buyeasy-api-cda6efdmdybsemfc.centralindia-01.azurewebsites.net/api/auth";

export const registerUser = (data) => axios.post(`${API_URL}/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/login`, data);
export const googleLogin = (idToken) => axios.post(`${API_URL}/google-login`, { idToken });