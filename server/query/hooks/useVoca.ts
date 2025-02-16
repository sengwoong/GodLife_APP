import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '../../common/types/constants';
interface Voca {
  id: number;
  vocaTitle: string;
  description: string;
}

interface VocaResponse {
  content: Voca[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}


