import { apiSlice } from "../../apiSlice";

export const dashboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSalesStats: builder.query({
      query: () => ({
        url: "/dashboard/sales-stats",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
      keepUnusedDataFor: 300,
    }),
    getGraphStats: builder.query({
      query: () => ({
        url: "/dashboard/graph-stats",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
      keepUnusedDataFor: 300,
    }),
    getRecentOrders: builder.query<any, void>({
      query: () => ({
        url: "/dashboard/recent-orders",
        method: "GET",
      }),
      providesTags: ["Dashboard"],
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetSalesStatsQuery,
  useGetGraphStatsQuery,
  useGetRecentOrdersQuery,
} = dashboardApi;
