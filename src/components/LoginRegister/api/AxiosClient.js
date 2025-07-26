// src/api/AxiosClient.js
import axios from 'axios';

const AxiosClient = axios.create({
  baseURL: 'https://lvanor-backend.up.railway.app/api/v1',
});
// https://lvanor-backend.up.railway.app/http://127.0.0.1:8000
export default AxiosClient;
