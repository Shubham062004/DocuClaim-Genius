import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UploadClaim } from '@/components/UploadClaim';
import { ClaimsList } from '@/components/ClaimsList';
import { NavBar } from '@/components/NavBar';
import { motion } from 'framer-motion';
import { Invoice } from '@/api/api';
import { fetchInvoices } from '@/api/api';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const fetchAndSetInvoices = useCallback(async () => {
    try {
      const invoicesData = await fetchInvoices();
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch invoices',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    console.log("use effect called")
    fetchAndSetInvoices();
  },[navigate, fetchAndSetInvoices]);

  const handleUploadSuccess = (newInvoice: Invoice) => {
    setInvoices((prevInvoices) => [newInvoice, ...prevInvoices]);
    toast({
      title: 'Upload Successful',
      description: 'Your invoice has been processed successfully',
    });
  };

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'Error',
        description: 'File size must be less than 5MB',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  return (
    <motion.div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <motion.div>
          <h1 className="text-3xl font-bold mb-2">Invoice Dashboard</h1>
          <p className="text-gray-600 mb-8">Upload, manage, and monitor your invoices in one place</p>
        </motion.div>
        
        {/* Upload Invoice */}
        <motion.div>
          <Card className="border-0 shadow-lg">
            <CardHeader />
            <CardContent>
              <UploadClaim 
                onUploadSuccess={handleUploadSuccess} 
                validateFile={validateFile}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Invoice History */}
        <motion.div>
          <Card className="border-0 shadow-lg mt-8">
            <CardHeader>
              <CardTitle>Invoice History</CardTitle>
              <CardDescription>View and manage all your processed invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimsList invoices={invoices} onRefresh={fetchAndSetInvoices} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
