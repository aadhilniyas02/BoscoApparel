import { apiSlice } from "../../apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders",
        method: "POST",
        data: orderData,
      }),
      invalidatesTags: [
        "Order",
        "Product", // Invalidate products to refresh stock/data
        { type: "Order", id: "LIST" },
      ],
    }),

    getOrderById: builder.query({
      query: (orderId) => ({
        url: `/orders/${orderId}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    getShippingData: builder.query({
      query: (shippingId) => ({
        url: `/orders/shipping/${shippingId}`,
        method: "GET",
      }),
      providesTags: (result, error, shippingId) => [
        { type: "Shipping", id: shippingId },
      ],
    }),

    cancelOrder: builder.mutation({
      query: ({ orderId, reason }) => ({
        url: `/orders/${orderId}/cancel`,
        method: "POST",
        data: { reason },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        "Order",
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),

    // getAllOrders: builder.query({
    //   query: ({ status, page = 1, limit = 10 } = {}) => {
    //     const params = new URLSearchParams();
    //     if (status) params.append("status", status);
    //     params.append("page", page.toString());
    //     params.append("limit", limit.toString());

    //     return {
    //       url: `/orders?${params.toString()}`,
    //       method: "GET",
    //     };
    //   },
    //   providesTags: (result, error, params) => [
    //     { type: "Order", id: "LIST" },
    //     { type: "Order", id: `STATUS-${params?.status || "ALL"}` },
    //     { type: "Order", id: `PAGE-${params?.page || 1}` },
    //   ],
    //   keepUnusedDataFor: 300,
    // }),
    getAllOrders: builder.query({
      query: ({
        status,
        page = 1,
        limit = 10,
        search = "",
      }: {
        status?: string;
        page?: number;
        limit?: number;
        search?: string;
      } = {}) => {
        const params = new URLSearchParams();
        if (status) params.append("status", status);
        if (search.trim()) params.append("search", search);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        return {
          url: `/orders?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: (result, error, params) => [
        { type: "Order", id: "LIST" },
        { type: "Order", id: `STATUS-${params?.status || "ALL"}` },
        { type: "Order", id: `SEARCH-${params?.search || "NONE"}` },
        { type: "Order", id: `PAGE-${params?.page || 1}` },
      ],
      keepUnusedDataFor: 300,
    }),

    updateOrderStatus: builder.mutation({
      query: ({ orderId, status, paymentStatus }) => ({
        url: `/orders/${orderId}/status`,
        method: "PUT",
        data: { status, paymentStatus },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        { type: "Order", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  useGetShippingDataQuery,
  useCancelOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
