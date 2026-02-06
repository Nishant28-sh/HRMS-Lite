import axios from "axios";

const API = axios.create({
  baseURL: "https://hrms-lite-851n.onrender.com",
});

export default API;
