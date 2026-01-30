import { apiSlice } from "../../apiSlice";
import { RootState } from "../../store";
import { clearUser, setUser } from "./authSlice";
import {
    User,
    LoginRequest,
    LoginResponse,
    SignupRequest,
    SignupResponse
} from "./types";

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // LOGIN
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "/auth/login",
                method: "POST",
                data: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const loginData = data.data;
                    // console.log("LOGINDAta", loginData)


                    if (loginData?.user && loginData?.accessToken) {
                        localStorage.setItem("refreshToken", loginData.refreshToken)

                        dispatch(
                            setUser({
                                user: loginData.user,
                                accessToken: loginData.accessToken,
                                refreshToken: loginData.refreshToken,
                            })
                        );
                    }
                } catch {
                    dispatch(clearUser());
                }
            },
        }),

        // SIGNUP
        signup: builder.mutation<SignupResponse, SignupRequest>({
            query: (newUser) => ({
                url: "/auth/register",
                method: "POST",
                data: newUser,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const signupData = data.data;

                    if (signupData?.user && signupData?.accessToken) {
                        localStorage.setItem("refreshToken", signupData.refreshToken)
                        dispatch(
                            setUser({
                                user: signupData.user,
                                accessToken: signupData.accessToken,
                                refreshToken: signupData.refreshToken,
                            })
                        );
                    }
                } catch {
                    dispatch(clearUser());
                }
            },
        }),


        refresh: builder.mutation<LoginResponse, string>({
            query: (refreshToken) => {
                // const refreshToken = localStorage.getItem("refreshToken");
                return {
                    url: "/auth/refresh-token",
                    method: "POST",
                    data: { refreshToken },
                };
            },
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const refreshData = data.data;

                    if (refreshData?.accessToken) {
                        dispatch(
                            setUser({
                                user: refreshData.user ?? null,
                                accessToken: refreshData.accessToken,
                                refreshToken: refreshData.refreshToken ?? null,
                                
                            })
                        );
                    }
                } catch {
                    dispatch(clearUser());
                }
            },
        }),


        // GET PROFILE
        getProfile: builder.query<{ user: User }, void>({
            query: () => ({
                url: "/auth/profile",
                method: "GET",
            }),
        }),

        // LOGOUT
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    localStorage.removeItem("refreshToken")
                    dispatch(clearUser());
                } catch (err) {
                    console.error("Logout failed", err);
                }
            },
        }),
    }),
    overrideExisting: false,
});

export const {
    useLoginMutation,
    useSignupMutation,
    useRefreshMutation,
    useGetProfileQuery,
    useLogoutMutation,
} = authApi;
