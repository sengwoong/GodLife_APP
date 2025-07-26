import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { VocaRequest } from '../../common/types/serverType'

export const vocaHandlers = [
  http.get(`${BASE_URL}/vocas/voca/:voca_id`, ({ params }) => {
    const voca_id = Number(params.voca_id);
    return HttpResponse.json({
      id: voca_id,
      vocaTitle: `기본 단어장 ${voca_id}`,
      languages: 'English',
      description: `기본 설명 ${voca_id}`
    });
  }),

  http.get(`${BASE_URL}/vocas/user/:user_id`, ({ params, request }) => {
    const { user_id } = params;
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const page = parseInt(url.searchParams.get('page') || '0', 10);
    const size = parseInt(url.searchParams.get('size') || '10', 10);

    const userVocas = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      vocaTitle: `단어장 ${i + 1}`,
      languages: ['English', '日本語', 'Tiếng Việt'][i % 3],
      userId: Number(user_id),
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

  http.get(`${BASE_URL}/vocas/my/:user_id`, ({ params, request }) => {
    const { user_id } = params;
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';

    const myVocas = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      vocaTitle: `내 단어장 ${i + 1}`,
      wordCount: Math.floor(Math.random() * 100) + 1,
      isShared: Math.random() > 0.5,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    }));

    const filteredVocas = myVocas.filter(voca => 
      voca.vocaTitle.toLowerCase().includes(search)
    );

    return HttpResponse.json(filteredVocas);
  }),

  http.get(`${BASE_URL}/vocas/purchased/:user_id`, ({ params, request }) => {
    const { user_id } = params;
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';

    const purchasedVocas = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      vocaTitle: `구매한 단어장 ${i + 1}`,
      price: Math.floor(Math.random() * 5000) + 1000,
      createdAt: new Date(Date.now() - (i * 24 * 60 * 60 * 1000)).toISOString(),
    }));

    const filteredVocas = purchasedVocas.filter(voca => 
      voca.vocaTitle.toLowerCase().includes(search)
    );

    return HttpResponse.json(filteredVocas);
  }),

  http.get(`${BASE_URL}/vocas/study/:user_id`, ({ params, request }) => {
    const { user_id } = params;
    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';

    const studyVocas = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      vocaTitle: `학습중인 단어장 ${i + 1}`,
      progress: `${Math.floor(Math.random() * 100)}/${Math.floor(Math.random() * 100) + 100}`,
    }));

    const filteredVocas = studyVocas.filter(voca => 
      voca.vocaTitle.toLowerCase().includes(search)
    );

    return HttpResponse.json(filteredVocas);
  }),

  http.post(`${BASE_URL}/vocas/user/:user_id`, async ({ params, request }) => {
    const body = await request.json() as VocaRequest;
    return HttpResponse.json({
      id: Date.now(), 
      vocaTitle: body.vocaTitle,
      description: body.description || '', 
      userId: params.user_id,
      languages: body.languages || ''
    });
  }),

  http.put(`${BASE_URL}/vocas/voca/:voca_id/user/:user_id`, async ({ params, request }) => {
    const body = await request.json() as VocaRequest;
    return HttpResponse.json({
      id: Number(params.voca_id),
      ...body,
      userId: params.user_id
    });
  }),

  http.put(`${BASE_URL}/vocas/share/:voca_id/user/:user_id`, async ({ params, request }) => {
    const body = await request.json() as {isShared: boolean}
    return HttpResponse.json({
      id: Number(params.voca_id),
      isShared: body.isShared,
      userId: Number(params.user_id)
    });
  }),

  http.delete(`${BASE_URL}/vocas/voca/:voca_id/user/:user_id`, () => {
    return new HttpResponse(null, { status: 200 })
  }),
] 