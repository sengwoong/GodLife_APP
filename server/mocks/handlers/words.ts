import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { WordRequest } from '../../common/types/serverType'

export const wordHandlers = [
  http.put(`${BASE_URL}/words/word/:wordId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as WordRequest
    return HttpResponse.json({
      id: params.wordId,
      ...body,
      userId: params.userId,
    })
  }),

  http.delete(`${BASE_URL}/words/word/:wordId/user/:userId`, ({ params }) => {
    return HttpResponse.json({
      id: params.wordId,
      userId: params.userId,
      deleted: true
    })
  }),

  http.post(`${BASE_URL}/words`, async ({ request }) => {
    const body = await request.json() as WordRequest
    return HttpResponse.json({
      id: Date.now(),
      ...body
    })
  }),

  http.get(`${BASE_URL}/words/voca/:vocaId`, ({ params, request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = 10;
    const index = parseInt(url.searchParams.get('index') || '-1', 10);

    // Mock data: Generate 1000 words for the given vocaId
    const allWords = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      word: `Word ${i + 1}`,
      meaning: `Meaning ${i + 1}`,
      vocaId: Number(params.vocaId)
    }));

    if (index >= 0) {
      // Return a specific word if index is provided
      return HttpResponse.json({
        content: [allWords[index]],
        totalPages: 1,
        totalElements: 1,
        size: 1,
        number: 0
      });
    }

    // Paginate the results
    const start = page * size;
    const end = start + size;
    const paginatedWords = allWords.slice(start, end);

    return HttpResponse.json({
      content: paginatedWords,
      totalPages: Math.ceil(allWords.length / size),
      totalElements: allWords.length,
      size,
      number: page
    });
  })
] 