import { Claim } from '@/api/types'; // Ensure Claim type is correctly imported

export const fetchClaims = async (): Promise<Claim[]> => {
  try {
    const response = await fetch('/api/claims'); // Replace with actual API URL
    if (!response.ok) {
      throw new Error('Failed to fetch claims');
    }
    const data: Claim[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching claims:', error);
    return []; // Return an empty array instead of `void`
  }
};
