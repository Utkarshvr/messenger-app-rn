import { useEffect } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { useAuth } from "@clerk/clerk-expo";
import axiosInstance from "@/config/axiosInstance";

const AxiosInterceptor = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    const fullfilledInterceptor = (response: AxiosResponse) => response;

    const errorInterceptor = async (error: AxiosError) => {
      if (error?.response?.status === 403) {
        console.log("AXIOS_INTERCEPTOR_ERROR", error);
        const newToken = await getToken();
        axiosInstance.defaults.headers.common["Authorization"] = newToken;

        // Clone the original request
        const originalRequest = error.config;
        if (originalRequest) {
          originalRequest.headers["Authorization"] = newToken;

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        }
      }

      return Promise.reject(error);
    };

    const interceptor = axiosInstance.interceptors.response.use(
      fullfilledInterceptor,
      errorInterceptor
    );

    return () => axiosInstance.interceptors.response.eject(interceptor);
  }, []);

  return <>{children}</>;
};

export default AxiosInterceptor;
