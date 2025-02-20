import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { Post } from '../../../types/post';
import { BASE_URL } from '../../common/types/constants';

interface PostResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
}

export const usePost = (category: string, search: string = '', page: number = 0) => {
  return useQuery<PostResponse>({
    queryKey: ['posts', category, search, page],
    queryFn: async () => {
        console.log("usePost");
        console.log("category");
        console.log(category);
      const response = await fetch(
        `${BASE_URL}/posts/category/${category}?search=${search}&page=${page}`
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

export const useLikePost = () => {
  return useMutation({
    mutationFn: async ({ postId, userId }: { postId: number, userId: number }) => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/like/user/${userId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    },
  });
};

export const useInfinitePosts = (searchText: string, category: string = 'post') => {
  return useInfiniteQuery<PostResponse>({
    queryKey: ['posts', searchText, category],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => 
      fetch(`${BASE_URL}/posts/category/${category}?search=${encodeURIComponent(searchText)}&page=${pageParam}`).then(res => res.json()),
    getNextPageParam: (lastPage: PostResponse) => {
      if (!lastPage.last) return lastPage.number + 1;
      return undefined;
    },
  });
};
