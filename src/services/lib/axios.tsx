import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_GEMINI_BASE_URL,
   headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
  },
});