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