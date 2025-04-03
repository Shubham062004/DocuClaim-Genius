import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { UploadClaim } from '@/components/UploadClaim';
import { ClaimsList } from '@/components/ClaimsList';
import { NavBar } from '@/components/NavBar';
import { motion } from 'framer-motion';
import { fetchClaims } from '@/api/fetchClaims';

export type Claim = {
  id: string;
  patientName: string;
  diagnosis: string;
  totalAmount: number;
  dateOfTreatment: string;
  status: 'processed' | 'pending' | 'rejected';
  uploadDate: string;
  documentUrl?: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [claims, setClaims] = useState<Claim[]>([]);

  // Fetch claims with useCallback to prevent unnecessary re-renders
  const fetchAndSetClaims = useCallback(async () => {
    try {
      const claimsData = await fetchClaims(); // Guaranteed to return an array
      setClaims(claimsData); // ✅ No more TypeScript errors
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch claims',
        variant: 'destructive',
      });
    }
  }, [toast]);

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchAndSetClaims();
  }, [navigate, fetchAndSetClaims]);

  const handleUploadSuccess = (newClaim: Claim) => {
    setClaims((prevClaims) => [newClaim, ...prevClaims]);
    toast({
      title: 'Upload Successful',
      description: 'Your claim has been processed successfully',
    });
  };

  return (
    <motion.div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <motion.div>
          <h1 className="text-3xl font-bold mb-2">Medical Claims Dashboard</h1>
          <p className="text-gray-600 mb-8">Upload, manage, and monitor your medical claims in one place</p>
        </motion.div>
        
        {/* Upload Medical Invoice */}
        <motion.div>
          <Card className="border-0 shadow-lg">
            <CardHeader />
            <CardContent>
              <UploadClaim onUploadSuccess={handleUploadSuccess} />
            </CardContent>
          </Card>
        </motion.div>

        {/* Claims History */}
        <motion.div>
          <Card className="border-0 shadow-lg mt-8">
            <CardHeader>
              <CardTitle>Claims History</CardTitle>
              <CardDescription>View and manage all your processed claims.</CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimsList claims={claims} onRefresh={fetchAndSetClaims} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
