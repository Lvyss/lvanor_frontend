// src/api/AxiosClient.js
import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: 'https://invanorbackend-production.up.railway.app/api/v1',
});
// https://invanorbackend-production.up.railway.app/
export default AxiosClient;
