import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileText, Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Invoice } from '@/api/api';
import { useState } from 'react';
import { InvoiceDetailsDialog } from '@/components/InvoiceDetailsDialog';

interface ClaimsListProps {
  invoices: Invoice[];
  onRefresh: () => void;
}

export function ClaimsList({ invoices, onRefresh }: ClaimsListProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleInvoiceClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const calculateTotal = (items: Invoice['items']) => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Processed Invoices</CardTitle>
            <CardDescription>
              View all your processed invoices
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
          {invoices.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-10 w-10 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No invoices yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Upload your first invoice to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.invoice_id}>
                    <TableCell>{invoice.invoice_id}</TableCell>
                    <TableCell>{new Date(invoice.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{formatCurrency(calculateTotal(invoice.items))}</TableCell>
                    <TableCell>{invoice.items.length}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleInvoiceClick(invoice)}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedInvoice && (
        <InvoiceDetailsDialog 
          invoice={selectedInvoice}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      )}
    </>
  );
}