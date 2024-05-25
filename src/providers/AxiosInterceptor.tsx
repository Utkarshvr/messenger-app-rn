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
        const token = await getToken();
        axiosInstance.defaults.headers.common["Authorization"] = token;
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
