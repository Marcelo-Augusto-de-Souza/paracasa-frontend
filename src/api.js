import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Lê do arquivo .env
});

export default api;