import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_URL,
});

export type InvoiceItem = {
  item_description: string;
  quantity: number;
  total: number;
  unit_price: number;
};

export type Invoice = {
  invoice_id: number;
  is_mock_data: boolean;
  items: InvoiceItem[];
  uploadedAt: string;
};

export const uploadInvoice = async (formData: FormData) => {
  const response = await api.post('/doc/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchInvoices = async (): Promise<Invoice[]> => {
  console.log("Fetching invoices...");
  try {
    const response = await api.get('/doc');
    const data: Invoice[] = response.data;
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }
};