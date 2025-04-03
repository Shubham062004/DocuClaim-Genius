import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Claim } from "@/pages/Dashboard";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";

interface ClaimDetailsDialogProps {
  claim: Claim;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClaimDetailsDialog({
  claim,
  open,
  onOpenChange,
}: ClaimDetailsDialogProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Claim Details</DialogTitle>
          <DialogDescription>
            Detailed information about this claim
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {claim.documentUrl && (
            <div className="border rounded-md overflow-hidden">
              <AspectRatio ratio={4/3}>
                <img
                  src={claim.documentUrl}
                  alt="Invoice document"
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          )}
          
          <div className="space-y-3">
            <DetailItem label="Patient Name" value={claim.patientName} />
            <DetailItem label="Diagnosis" value={claim.diagnosis} />
            <DetailItem 
              label="Amount" 
              value={formatCurrency(claim.totalAmount)} 
            />
            <DetailItem label="Treatment Date" value={claim.dateOfTreatment} />
            <DetailItem 
              label="Status" 
              value={claim.status.charAt(0).toUpperCase() + claim.status.slice(1)} 
              status={claim.status}
            />
            <DetailItem label="Upload Date" value={claim.uploadDate} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DetailItemProps {
  label: string;
  value: string;
  status?: string;
}

function DetailItem({ label, value, status }: DetailItemProps) {
  const getStatusClass = (status?: string) => {
    if (!status) return "";
    switch (status) {
      case "processed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "rejected":
        return "text-red-600";
      default:
        return "";
    }
  };

  return (
    <div>
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className={`text-base ${status ? getStatusClass(status) : ""}`}>{value}</div>
      <Separator className="mt-2" />
    </div>
  );
}