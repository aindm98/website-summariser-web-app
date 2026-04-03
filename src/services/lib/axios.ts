import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:import.meta.env.VITE_RAPIDAPI_BASE_URL,
   headers: {
    "Content-Type": "application/json",
    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_API_KEY,
    'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_HOST,
  },
});