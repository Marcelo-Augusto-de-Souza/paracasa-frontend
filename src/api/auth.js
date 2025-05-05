import axios from "axios";

const API_URL = "http://127.0.0.1:5000"; // URL do seu backend Flask

export const loginUser = async (userType, email, password) => {
  const response = await axios.post(`${API_URL}/login`, {
    userType,
    email,
    password,
  });
  return response.data;
};
