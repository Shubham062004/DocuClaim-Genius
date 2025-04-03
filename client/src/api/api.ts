import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const uploadInvoice = async (formData: FormData) => {
  const response = await api.post('/doc/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchClaims = async () => {
  const response = await api.get('/claims');
  return response.data;
};
