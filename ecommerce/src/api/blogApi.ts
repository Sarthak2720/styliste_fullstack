import axiosInstance from "./axios";

/* ─── Types ─── */

export interface BlogSectionData {
  [key: string]: unknown;
}

export interface BlogSection {
  id: string;
  type: string;
  data: BlogSectionData;
}

export interface BlogPostSummary {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverUrl: string;
  author: string;
  readTime: string;
  status: "DRAFT" | "PUBLISHED";
  sectionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostDetail extends Omit<BlogPostSummary, "sectionsCount"> {
  sections: BlogSection[];
}

export interface BlogPostCreateRequest {
  title: string;
  category: string;
  excerpt: string;
  coverUrl: string;
  author: string;
  readTime: string;
  status: "DRAFT" | "PUBLISHED";
  sections: BlogSection[];
}

export type BlogPostUpdateRequest = BlogPostCreateRequest;

export interface PublicBlogSummary {
  id: number;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  coverUrl: string;
  author: string;
  readTime: string;
  createdAt: string;
}

export interface PublicBlogDetail extends PublicBlogSummary {
  sections: BlogSection[];
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/* ─── Admin API ─── */

export const blogAdminApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await axiosInstance.post<{ url: string }>("/admin/blogs/upload-image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 30_000,
    });
    return res.data;
  },

  list: async (): Promise<BlogPostSummary[]> => {
    const res = await axiosInstance.get<BlogPostSummary[]>("/admin/blogs");
    return res.data;
  },

  getById: async (id: number): Promise<BlogPostDetail> => {
    const res = await axiosInstance.get<BlogPostDetail>(`/admin/blogs/${id}`);
    return res.data;
  },

  create: async (data: BlogPostCreateRequest): Promise<BlogPostDetail> => {
    const res = await axiosInstance.post<BlogPostDetail>("/admin/blogs", data);
    return res.data;
  },

  update: async (id: number, data: BlogPostUpdateRequest): Promise<BlogPostDetail> => {
    const res = await axiosInstance.put<BlogPostDetail>(`/admin/blogs/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/admin/blogs/${id}`);
  },

  setStatus: async (id: number, status: "DRAFT" | "PUBLISHED"): Promise<BlogPostDetail> => {
    const res = await axiosInstance.patch<BlogPostDetail>(`/admin/blogs/${id}/status`, { status });
    return res.data;
  },
};

/* ─── Public API ─── */

export const blogPublicApi = {
  list: async (params?: {
    category?: string;
    page?: number;
    size?: number;
  }): Promise<PaginatedResponse<PublicBlogSummary>> => {
    const res = await axiosInstance.get<PaginatedResponse<PublicBlogSummary>>("/blogs", { params });
    return res.data;
  },

  getBySlug: async (slug: string): Promise<PublicBlogDetail> => {
    const res = await axiosInstance.get<PublicBlogDetail>(`/blogs/${slug}`);
    return res.data;
  },

  getCategories: async (): Promise<string[]> => {
    const res = await axiosInstance.get<string[]>("/blogs/categories");
    return res.data;
  },
};
