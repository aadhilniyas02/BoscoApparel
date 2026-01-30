import { apiSlice } from "../../apiSlice";
import {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateCategoryResponse,
  GetCategoriesResponse,
} from "./types";

export const categoryApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET ALL CATEGORIES
    getCategories: builder.query<GetCategoriesResponse, void>({
      query: () => ({
        url: "/categories",
        method: "GET",
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.categories.map(({ _id }) => ({
                type: "Category" as const,
                id: _id,
              })),
              { type: "Category", id: "LIST" },
            ]
          : [{ type: "Category", id: "LIST" }],
    }),

    // GET CATEGORY BY ID
    getCategoryById: builder.query<
      { success: boolean; category: Category },
      string
    >({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Category", id }],
    }),

    // CREATE CATEGORY
    createCategory: builder.mutation<CreateCategoryResponse, FormData>({
      query: (categoryData) => {
        // Log form data contents for debugging
        // console.log("Creating category with form data:");
        for (const [key, value] of categoryData.entries()) {
          console.log(`${key}:`, value);
        }

        return {
          url: "/categories",
          method: "POST",
          data: categoryData,
        };
      },
      invalidatesTags: [{ type: "Category", id: "LIST" }],
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          message:
            response.data?.message ||
            "An error occurred while creating the category",
          errors: response.data?.errors || [],
        };
      },
    }),

    // UPDATE CATEGORY
    updateCategory: builder.mutation<
      CreateCategoryResponse,
      UpdateCategoryRequest
    >({
      query: ({ id, data }) => {
        // Log form data contents for debugging
        // console.log(`Updating category ${id} with form data:`);
        for (const [key, value] of data.entries()) {
          console.log(`${key}:`, value);
        }

        return {
          url: `/categories/${id}`,
          method: "PUT",
          data: data,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
      transformErrorResponse: (response: any) => {
        return {
          status: response.status,
          message:
            response.data?.message ||
            "An error occurred while updating the category",
          errors: response.data?.errors || [],
        };
      },
    }),

    // DELETE CATEGORY
    deleteCategory: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),

    // TOGGLE CATEGORY STATUS
    toggleCategoryStatus: builder.mutation<
      { success: boolean; category: Category },
      string
    >({
      query: (categoryId) => ({
        url: `/categories/${categoryId}/status`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useToggleCategoryStatusMutation,
} = categoryApi;
