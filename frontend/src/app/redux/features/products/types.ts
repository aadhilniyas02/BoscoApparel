export interface ProductImage {
  url: string;
  alt: string;
  publicId: string;
  file?: File;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    id: string;
  };
  images: ProductImage[];
  inventory: {
    quantity: number;
    inStock: boolean;
  };
  status: string;
  discountPercent?: number;
  brand?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  totalActive: number;
  products: Product[];
}

export interface ProductByIdResponse {
  success: boolean;
  product: Product;
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface UpdateProductResponse {
  success: boolean;
  message: string;
  product: Product;
}

export interface DeleteProductResponse {
  success: boolean;
  message: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number | string;
  category: string;
  discountPercent: number | string;
  // variants: ProductVariant[];
  quantity: number | string;
  images: ProductImage[];
  imagesToDelete: string[];
}

export interface GetProductsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetNewArrivalsParams {
  limit?: number;
}
