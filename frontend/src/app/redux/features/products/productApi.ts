import { apiSlice } from "../../apiSlice";
import {
  Product,
  ProductsResponse,
  ProductByIdResponse,
  CreateProductResponse,
  UpdateProductResponse,
  DeleteProductResponse,
  GetProductsParams,
  GetNewArrivalsParams,
} from "./types";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL PRODUCTS
    getProducts: builder.query<ProductsResponse, GetProductsParams>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();

        // Add parameters only if they exist and are not default values
        if (params?.category && params?.category !== "All") {
          queryParams.append("category", params.category);
        }
        if (params?.search && params?.search.trim()) {
          queryParams.append("search", params.search.trim());
        }
        if (params?.page && params?.page > 1) {
          queryParams.append("page", params.page.toString());
        }
        if (params?.limit && params?.limit !== 10) {
          queryParams.append("limit", params.limit.toString());
        }

        const queryString = queryParams.toString();

        return {
          url: `/products${queryString ? `?${queryString}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (result, error, params) => [
        // Dynamic cache tags based on query parameters
        { type: "Product" as const, id: "LIST" },
        {
          type: "Product" as const,
          id: `CATEGORY-${params.category || "All"}`,
        },
        { type: "Product" as const, id: `SEARCH-${params.search || ""}` },
      ],
      // Keep cached data for 5 minutes
      keepUnusedDataFor: 300,
    }),

    // GET PRODUCT BY ID
    getProductById: builder.query<ProductByIdResponse, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // CREATE PRODUCT
    createProduct: builder.mutation<CreateProductResponse, FormData>({
      query: (productData) => ({
        url: "/products",
        method: "POST",
        data: productData,
      }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "NEW_ARRIVALS" },
      ],
    }),

    // UPDATE PRODUCT
    updateProduct: builder.mutation<
      UpdateProductResponse,
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        data: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id: "LIST" },
        { type: "Product", id },
        { type: "Product", id: "NEW_ARRIVALS" },
      ],
    }),

    // DELETE PRODUCT
    deleteProduct: builder.mutation<DeleteProductResponse, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Product", id: "LIST" },
        { type: "Product", id: "NEW_ARRIVALS" },
      ],
    }),

    // GET NEW ARRIVALS
    getNewArrivals: builder.query<ProductsResponse, GetNewArrivalsParams>({
      query: ({ limit = 10 } = {}) => ({
        url: `/products/new-arrivals?limit=${limit}`,
        method: "GET",
      }),
      providesTags: [{ type: "Product", id: "NEW_ARRIVALS" }],
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetProductsQuery,
  useLazyGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetNewArrivalsQuery,
} = productApi;
