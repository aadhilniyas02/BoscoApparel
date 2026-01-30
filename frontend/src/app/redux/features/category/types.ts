export interface CategoryImage {
  url: string;
  alt: string;
  publicId: string;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  image?: CategoryImage;
  isActive: boolean;
  featured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  image?: File;
  isActive?: boolean;
  featured?: boolean;
  displayOrder?: number;
}
export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  category: Category;
}
export interface UpdateCategoryRequest {
  id: string;
  data: FormData;
}
export interface GetCategoriesResponse {
  success: boolean;
  count: number;
  categories: Category[];
}
