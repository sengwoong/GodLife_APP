import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { WordRequest } from '../../common/types/serverType'

// 단어 목록 생성 헬퍼 함수
const generateWords = (voca_id: string | number, count = 100) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    word: `Word ${i + 1}`,
    meaning: `Meaning for word ${i + 1}`,
    vocaId: Number(voca_id),
  }));
};

export const wordHandlers = [
  http.post(`${BASE_URL}/words`, async ({ request }) => {
    const body = await request.json() as WordRequest;
    return HttpResponse.json({
      id: Date.now(),
      ...body
    });
  }),

  http.get(`${BASE_URL}/words/word/:word_id`, ({ params }) => {
    const { word_id } = params;
    return HttpResponse.json({
      id: word_id,
      word: `Word ${word_id}`,
      meaning: `Meaning for word ${word_id}`
    });
  }),

  http.get(`${BASE_URL}/words/voca/:voca_id`, ({ params, request }) => {
    const { voca_id } = params;
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const index = url.searchParams.get('index');
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const words = generateWords(Number(voca_id));
    
    if (index !== null) {
      const wordIndex = parseInt(index, 10);
      if (wordIndex >= 0 && wordIndex < words.length) {
        return HttpResponse.json({
          content: [words[wordIndex]],
          totalPages: 1,
          totalElements: 1,
          size: 1,
          number: 0
        });
      }
    }

    const filteredWords = words.filter(word => 
      word.word.toLowerCase().includes(search) || 
      word.meaning.toLowerCase().includes(search)
    );

    const start = page * size;
    const end = start + size;
    const paginatedWords = filteredWords.slice(start, end);

    return HttpResponse.json({
      content: paginatedWords,
      totalPages: Math.ceil(filteredWords.length / size),
      totalElements: filteredWords.length,
      size,
      number: page
    });
  }),

  http.put(`${BASE_URL}/words/word/:word_id/user/:user_id`, async ({ params, request }) => {
    const body = await request.json() as WordRequest;
    return HttpResponse.json({
      id: params.word_id,
      ...body,
      userId: params.user_id,
    });
  }),

  http.delete(`${BASE_URL}/words/word/:word_id/user/:user_id`, ({ params }) => {
    return HttpResponse.json({
      id: params.word_id,
      userId: params.user_id,
      deleted: true
    });
  }),
] 