import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';

export function createApiInstance(baseURL: string) {
  const api = axios.create({
    baseURL,
    timeout: 0,
  });

  api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["ngrok-skip-browser-warning"] = "true";

    }
    return config;
  });

  const makeRequest = <T = unknown>(config: AxiosRequestConfig): Promise<T> => {
    return api.request<T>(config)
      .then(res => res.data)
      .catch((err: unknown) => {
        if (typeof err === 'object' && err && 'response' in err) {
          // @ts-expect-error: ép kiểu err để truy cập err.response cho axios error
          throw (err as { response?: unknown }).response?.data || err;
        }
        throw err;
      });
  };

  return { makeRequest };
}
