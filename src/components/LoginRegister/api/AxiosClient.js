// src/api/AxiosClient.js
import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1',
});
// https://invanorbackend-production.up.railway.app/
export default AxiosClient;
