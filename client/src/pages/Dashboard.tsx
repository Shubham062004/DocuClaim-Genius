
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { UploadClaim } from "@/components/UploadClaim";
import { ClaimsList } from "@/components/ClaimsList";
import { NavBar } from "@/components/NavBar";
import { motion } from "framer-motion";
import { FileUp, ListChecks } from "lucide-react";

export type Claim = {
  id: string;
  patientName: string;
  diagnosis: string;
  totalAmount: number;
  dateOfTreatment: string;
  status: "processed" | "pending" | "rejected";
  uploadDate: string;
  documentUrl?: string;
};

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [activeTab, setActiveTab] = useState("upload");

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    // Fetch claims
    fetchClaims();
  }, [navigate]);

  const fetchClaims = async () => {
    setIsLoading(true);
    try {
      // Mock API call to fetch claims
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setClaims([
        {
          id: "1",
          patientName: "John Doe",
          diagnosis: "Influenza",
          totalAmount: 450.75,
          dateOfTreatment: "2023-05-15",
          status: "processed",
          uploadDate: "2023-05-16",
        },
        {
          id: "2",
          patientName: "Alice Smith",
          diagnosis: "Fractured wrist",
          totalAmount: 1250.00,
          dateOfTreatment: "2023-04-22",
          status: "processed",
          uploadDate: "2023-04-23",
        },
        {
          id: "3",
          patientName: "Robert Johnson",
          diagnosis: "Hypertension",
          totalAmount: 325.50,
          dateOfTreatment: "2023-06-01",
          status: "pending",
          uploadDate: "2023-06-02",
        }
      ]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch claims",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = (newClaim: Claim) => {
    setClaims(prevClaims => [newClaim, ...prevClaims]);
    setActiveTab("claims");
    toast({
      title: "Upload Successful",
      description: "Your claim has been processed successfully",
    });
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <NavBar />
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-2">Medical Claims Dashboard</h1>
          <p className="text-gray-600 mb-8">Upload, manage, and monitor your medical claims in one place</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FileUp className="h-4 w-4" /> Upload Claim
              </TabsTrigger>
              <TabsTrigger value="claims" className="flex items-center gap-2">
                <ListChecks className="h-4 w-4" /> View Claims
              </TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-6">
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Upload Medical Invoice</CardTitle>
                    <CardDescription>
                      Upload your medical invoice and our AI will automatically extract the relevant information.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UploadClaim onUploadSuccess={handleUploadSuccess} />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            <TabsContent value="claims" className="mt-6">
              <motion.div
                variants={fadeIn}
                initial="initial"
                animate="animate"
              >
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Claims History</CardTitle>
                    <CardDescription>
                      View and manage all your processed claims.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ClaimsList claims={claims} isLoading={isLoading} onRefresh={fetchClaims} />
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
