import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosRequestConfig } from "axios";
import { RootState } from "./store";

const axiosInstance = axios.create({
   baseURL: "http://localhost:5000/api",
  //baseURL: "https://boscoapparelbackend.vercel.app/api",
  withCredentials: true,
});

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig["method"];
      data?: any;
      headers?: Record<string, string>;
    },
    unknown,
    unknown
  > =>
    async ({ url, method, data, headers }, { getState }) => {
      try {
        const token = (getState() as RootState).auth.accessToken;

        const result = await axiosInstance({
          url,
          method,
          data,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(headers || {}),
            ...(!(data instanceof FormData) && {
              "Content-Type": "application/json",
            }),
          },
        });

        return { data: result.data };
      } catch (axiosError: any) {
        return {
          error: {
            status: axiosError.response?.status,
            data: axiosError.response?.data,
          },
        };
      }
    };
