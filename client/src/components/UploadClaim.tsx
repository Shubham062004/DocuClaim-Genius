import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadInvoice, Invoice } from '@/api/api';

interface UploadClaimProps {
  onUploadSuccess: (invoice: Invoice) => void;
  validateFile?: (file: File) => boolean;
}

export function UploadClaim({ onUploadSuccess, validateFile }: UploadClaimProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file if validator is provided
      if (validateFile && !validateFile(selectedFile)) {
        return;
      }

      setFile(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await uploadInvoice(formData);
      
      if (!response.processedData) {
        throw new Error('Invalid response from server');
      }

      onUploadSuccess(response.processedData);

      // Reset form
      setFile(null);
      setPreview(null);

      toast({
        title: 'Upload Successful',
        description: 'Your invoice has been processed successfully',
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'There was an error uploading your invoice',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Invoice</CardTitle>
        <CardDescription>
          Upload an invoice to process it with AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Upload Document (Image)</Label>
            <Input
              id="file"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500">
              Supported formats: JPG, PNG (max 5MB)
            </p>
          </div>

          {preview && (
            <div className="mt-4 border rounded-md overflow-hidden">
              <img
                src={preview}
                alt="Document preview"
                className="object-cover w-full h-full"
              />
            </div>
          )}

          {!preview && file && (
            <div className="mt-4 border rounded-md p-4 text-center bg-gray-50">
              <p className="text-gray-700">{file.name}</p>
              <p className="text-xs text-gray-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload and Process
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        Your document will be processed with AI to extract key information
      </CardFooter>
    </Card>
  );
}