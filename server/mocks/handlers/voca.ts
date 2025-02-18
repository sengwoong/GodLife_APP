import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { VocaRequest } from '../../common/types/serverType'

interface Voca {
  id: number;
  vocaTitle: string;
  description: string;
}

export const vocaHandlers = [
  http.put(`${BASE_URL}/vocas/voca/:vocaId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as VocaRequest
    return HttpResponse.json({
      id: params.vocaId,
      ...body,
      userId: params.userId
    })
  }),

  http.delete(`${BASE_URL}/vocas/voca/:vocaId/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.get(`${BASE_URL}/vocas/user/:userId`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    console.log('search', search)
    // Mock data
    const allVocas: Voca[] = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      vocaTitle: `기본 단어장 ${i + 1}`,
      description: `기본 설명 ${i + 1}`
    }));

    // Filter vocas based on search text
    const filteredVocas = allVocas.filter(voca => 
      voca.vocaTitle.toLowerCase().includes(search)
    );

    // Paginate the filtered results
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = 10;
    const start = page * size;
    const end = start + size;
    const paginatedVocas = filteredVocas.slice(start, end);

    return HttpResponse.json({
      content: paginatedVocas,
      totalPages: Math.ceil(filteredVocas.length / size),
      totalElements: filteredVocas.length,
      size,
      number: page
    })
  }),

  http.post(`${BASE_URL}/vocas/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as VocaRequest;
    return HttpResponse.json({
      id: Date.now(), 
      vocaTitle: body.vocaTitle,
      description: body.description || '', 
      userId: params.userId,
    });
  })
] 