import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000", // later Vercel env
});

export default API;
