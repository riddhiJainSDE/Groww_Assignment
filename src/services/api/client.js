// src/services/api/client.ts
import axios from "axios";

const client = axios.create({
  baseURL: "/api", // proxied endpoints on serverless side
  timeout: 10000,
});

export default client;
