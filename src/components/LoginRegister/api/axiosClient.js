// src/api/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://invanorbackend-production.up.railway.app/api/v1',
});
// https://invanorbackend-production.up.railway.app/
export default axiosClient;
