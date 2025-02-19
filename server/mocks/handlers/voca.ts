import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { VocaRequest } from '../../common/types/serverType'



export const vocaHandlers = [
  http.put(`${BASE_URL}/vocas/voca/:vocaId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as VocaRequest
    console.log('vocaHandlers', body)
    return HttpResponse.json({
      id: params.vocaId,
      ...body,
      userId: params.userId
    })
  }),
  
  http.get(`${BASE_URL}/vocas/voca/:vocaId`, ({ params }) => {
    const vocaId = Number(params.vocaId);
    // Mock data for single voca
    return HttpResponse.json({
      id: vocaId,
      vocaTitle: `기본 단어장 ${vocaId}`,
      languages: 'English',
      description: `기본 설명 ${vocaId}`
    });
  }),

  http.delete(`${BASE_URL}/vocas/voca/:vocaId/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.get(`${BASE_URL}/vocas/user/:userId`, ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    console.log('search', search)
    // Mock data
    let languages = ['English', '日本語', 'Tiếng Việt', '中文', 'Русский'];
    const allVocas: Voca[] = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      vocaTitle: `기본 단어장 ${i + 1}`,
      languages: languages[i % languages.length]
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
      languages: body.languages || ''
    });
  }),

  http.put(`${BASE_URL}/vocas/voca/:vocaId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as VocaRequest;
    return HttpResponse.json({
      id: Number(params.vocaId),
      ...body,
      userId: params.userId
    });
  }),
] 