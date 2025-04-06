import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Invoice } from "@/api/api";
import { Separator } from "@/components/ui/separator";

interface InvoiceDetailsDialogProps {
  invoice: Invoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceDetailsDialog({
  invoice,
  open,
  onOpenChange,
}: InvoiceDetailsDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invoice Details</DialogTitle>
          <DialogDescription>
            Detailed information about this invoice
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <DetailItem label="Invoice ID" value={invoice.invoice_id.toString()} />
            <DetailItem 
              label="Upload Date" 
              value={new Date(invoice.uploadedAt).toLocaleString()} 
            />
            <DetailItem 
              label="Total Amount" 
              value={formatCurrency(calculateTotal(invoice.items))} 
            />
            <DetailItem 
              label="Number of Items" 
              value={invoice.items.length.toString()} 
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="font-medium">Items</h4>
            {invoice.items.map((item, index) => (
              <div key={index} className="space-y-2">
                <DetailItem label="Description" value={item.item_description} />
                <DetailItem label="Quantity" value={item.quantity.toString()} />
                <DetailItem label="Unit Price" value={formatCurrency(item.unit_price)} />
                <DetailItem label="Total" value={formatCurrency(item.total)} />
                {index < invoice.items.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-sm">{value}</span>
    </div>
  );
} 