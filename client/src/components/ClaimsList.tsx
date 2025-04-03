import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileText, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Claim } from '@/pages/Dashboard';
import { useState } from 'react';
import { ClaimDetailsDialog } from '@/components/ClaimDetailsDialog';

interface ClaimsListProps {
  claims: Claim[];
  onRefresh: () => void;
}

export function ClaimsList({ claims, onRefresh }: ClaimsListProps) {
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewClaim = (claim: Claim) => {
    setSelectedClaim(claim);
    setDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Processed Claims</CardTitle>
            <CardDescription>
              View all your processed medical claims
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {claims.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-10 w-10 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No claims yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Upload your first medical invoice to get started
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient Name</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-medium">{claim.patientName}</TableCell>
                      <TableCell>{claim.diagnosis}</TableCell>
                      <TableCell>{formatCurrency(claim.totalAmount)}</TableCell>
                      <TableCell>{claim.dateOfTreatment}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(claim.status)}`}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewClaim(claim)}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedClaim && (
        <ClaimDetailsDialog 
          claim={selectedClaim}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}