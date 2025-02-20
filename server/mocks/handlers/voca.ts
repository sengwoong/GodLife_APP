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

  http.get(`${BASE_URL}/vocas/user/:userId`, ({ params, request }) => {
    const { userId } = params;
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const userVocas = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      vocaTitle: `단어장 ${i + 1}`,
      languages: ['English', '日本語', 'Tiếng Việt'][i % 3],
      userId: Number(userId),
      description: `설명 ${i + 1}`,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const filteredVocas = userVocas.filter(voca => 
      voca.vocaTitle.toLowerCase().includes(search)
    );

    const start = page * size;
    const end = start + size;
    const paginatedVocas = filteredVocas.slice(start, end);

    return HttpResponse.json({
      content: paginatedVocas,
      totalPages: Math.ceil(filteredVocas.length / size),
      totalElements: filteredVocas.length,
      size,
      number: page
    });
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