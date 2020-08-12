import axios from 'axios';

const api = axios.create({
  baseURL: 'https://jotavitor.com.br/gobarber-api',
});

export default api;
