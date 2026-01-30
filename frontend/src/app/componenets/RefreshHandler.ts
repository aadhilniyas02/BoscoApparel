"use client";

import { useEffect } from "react";
import { useRefreshMutation } from "../redux/features/auth/authApi";


function RefreshHandler() {
  // const [refresh] = useRefreshMutation();
  const [refresh, { isLoading, isError, data }] = useRefreshMutation();
  // const refreshToken = localStorage.getItem("refreshToken")

  // useEffect(() => {
  //     console.log(refreshToken)
  //     if (refreshToken) {
  //         refresh(refreshToken);
  //     }
  // }, [refresh]);
  useEffect(() => {

    if (typeof window !== "undefined") {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        console.log(refreshToken);
        refresh(refreshToken);
      }
    }
  }, [refresh]);

  return null;
}

export default RefreshHandler;
