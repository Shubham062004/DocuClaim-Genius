import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { uploadInvoice } from '@/api/api';
import type { Claim } from '@/api/types'; 
interface UploadClaimProps {
  onUploadSuccess: (claim: Claim) => void;
}

export function UploadClaim({ onUploadSuccess }: UploadClaimProps) {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreview(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        // For PDFs, show a generic preview
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

      const response = await uploadInvoice(formData); // Use the imported function
      const newClaim = response.processedData;

      onUploadSuccess(newClaim);

      // Reset form
      setFile(null);
      setPreview(null);

      toast({
        title: 'Upload Successful',
        description: 'Your claim has been processed successfully',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your claim',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Medical Invoice</CardTitle>
        <CardDescription>
          Upload a medical invoice or discharge summary to process it with AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="file">Upload Document (PDF/Image)</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            <p className="text-xs text-gray-500">
              Supported formats: PDF, JPG, PNG (max 10MB)
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
      <CardFooter className="flex justify-center text-xs text-gray-500">
        Your document will be processed with AI to extract key information
      </CardFooter>
    </Card>
  );
}