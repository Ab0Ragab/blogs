"use client";

import { create } from "zustand";

export type BlogPost = {
  id: number;
  title: string;
  author: string;
  date: string;
  content?: string;
  description?: string;
};

export type BlogFilters = {
  search: string;
  from: string;
  to: string;
};

type BlogState = {
  posts: BlogPost[];
  postsLoaded: boolean;
  activePost?: BlogPost;
  filters: BlogFilters;
  setPosts: (posts: BlogPost[]) => void;
  setActivePost: (post?: BlogPost) => void;
  upsertPost: (post: BlogPost) => void;
  applyFilters: (filters: Partial<BlogFilters>) => void;
  resetFilters: () => void;
};

const emptyFilters: BlogFilters = {
  search: "",
  from: "",
  to: "",
};

export const useBlogStore = create<BlogState>((set) => ({
  posts: [],
  postsLoaded: false,
  activePost: undefined,
  filters: emptyFilters,
  setPosts: (posts) => set({ posts, postsLoaded: true }),
  setActivePost: (post) => set({ activePost: post }),
  upsertPost: (post) =>
    set((state) => {
      const exists = state.posts.some((item) => item.id === post.id);

      return {
        activePost: post,
        posts: exists
          ? state.posts.map((item) => (item.id === post.id ? { ...item, ...post } : item))
          : [...state.posts, post],
        postsLoaded: true,
      };
    }),
  applyFilters: (filters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    })),
  resetFilters: () => set({ filters: emptyFilters }),
}));

export function filterPosts(posts: BlogPost[], filters: BlogFilters) {
  const query = filters.search.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesSearch =
      !query ||
      post.title.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query);
    const matchesFrom = !filters.from || post.date >= filters.from;
    const matchesTo = !filters.to || post.date <= filters.to;

    return matchesSearch && matchesFrom && matchesTo;
  });
}
