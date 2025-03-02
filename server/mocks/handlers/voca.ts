import { http, HttpResponse } from 'msw'
import { BASE_URL } from '../../common/types/constants'
import { VocaRequest } from '../../common/types/serverType'
import { VocaShareRequest } from '../../../types/voca'

export const vocaHandlers = [
  // Read 작업
  // 단일 단어장 조회
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

  // 사용자 단어장 목록 조회
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

  // 내 단어장 조회
  http.get(`${BASE_URL}/vocas/my/:userId`, ({ request }) => {
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

  // 구매한 단어장 조회
  http.get(`${BASE_URL}/vocas/purchased/:userId`, ({ request }) => {
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

  // 학습중인 단어장 조회
  http.get(`${BASE_URL}/vocas/study/:userId`, ({ request }) => {
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

  // Create 작업
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

  // Update 작업
  http.put(`${BASE_URL}/vocas/voca/:vocaId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as VocaRequest;
    return HttpResponse.json({
      id: Number(params.vocaId),
      ...body,
      userId: params.userId
    });
  }),

  // 단어장 공유 상태 업데이트
  http.put(`${BASE_URL}/vocas/share/:vocaId/user/:userId`, async ({ params, request }) => {
    const body = await request.json() as VocaShareRequest;
    return HttpResponse.json({
      id: Number(params.vocaId),
      isShared: body.isShared,
      userId: Number(params.userId)
    });
  }),

  // Delete 작업
  http.delete(`${BASE_URL}/vocas/voca/:vocaId/user/:userId`, () => {
    return new HttpResponse(null, { status: 200 })
  }),
] 