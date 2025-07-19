import { useMutation, useQuery } from '@tanstack/react-query';
import { AI_URL } from '../../common/types/constants';

// API 타입 정의
interface VocabularyRequest {
  count?: number;
  school_level?: string;
  topic?: string;
  language?: string;
  userId?: string;
  vocaId?: string;
}

interface VocabularyItem {
  word: string;
  meaning: string;
}

interface VocabularyGenerateRequest {
  items: VocabularyItem[];
  userId?: string;
  vocaId?: string;
}

interface VocabularyResponse {
  status: string;
  data: Array<{
    word: string;
    meaning: string;
    options: string[];
  }>;
}

// 단어장 생성 API
const generateVocabulary = async (params: VocabularyRequest): Promise<VocabularyResponse> => {
  const url = `${AI_URL}/vocabulary/generate`;
  console.log('AI API 호출 URL:', url);
  console.log('요청 파라미터:', params);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    console.log('응답 상태:', response.status);
    console.log('응답 헤더:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 응답 에러:', errorText);
      throw new Error(`단어장 생성에 실패했습니다. (${response.status})`);
    }

    const result = await response.json();
    console.log('API 응답 성공:', result);
    return result;
  } catch (error) {
    console.error('API 호출 중 에러:', error);
    throw error;
  }
};

// 선택지 포함 단어장 생성 API
const generateVocabularyWithOptions = async (params: VocabularyGenerateRequest): Promise<VocabularyResponse> => {
  const response = await fetch(`${AI_URL}/vocabulary/generate-options`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('선택지 생성에 실패했습니다.');
  }

  return response.json();
};

// 단어장 조회 API
const getVocabularyItems = async (params: {
  userId?: string;
  vocaId?: string;
  limit?: number;
  skip?: number;
}): Promise<VocabularyResponse> => {
  const queryParams = new URLSearchParams();
  if (params.userId) queryParams.append('userId', params.userId);
  if (params.vocaId) queryParams.append('vocaId', params.vocaId);
  if (params.limit) queryParams.append('limit', params.limit.toString());
  if (params.skip) queryParams.append('skip', params.skip.toString());

  const response = await fetch(`${AI_URL}/vocabulary?${queryParams}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('단어장 조회에 실패했습니다.');
  }

  return response.json();
};

// React Query 훅들
export const useGenerateVocabulary = () => {
  return useMutation({
    mutationFn: generateVocabulary,
    onError: (error) => {
      console.error('단어장 생성 오류:', error);
      // 네트워크 에러인 경우 더 자세한 정보 제공
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        console.error('네트워크 요청 실패 - 백엔드 서버가 실행 중인지 확인하세요');
        console.error('예상 URL:', `${AI_URL}/vocabulary/generate`);
      }
    },
  });
};

export const useGenerateVocabularyWithOptions = () => {
  return useMutation({
    mutationFn: generateVocabularyWithOptions,
    onError: (error) => {
      console.error('선택지 생성 오류:', error);
    },
  });
};

export const useGetVocabularyItems = (params: {
  userId?: string;
  vocaId?: string;
  limit?: number;
  skip?: number;
}) => {
  return useQuery({
    queryKey: ['vocabulary-items', params],
    queryFn: () => getVocabularyItems(params),
    enabled: !!(params.userId || params.vocaId),
  });
}; 