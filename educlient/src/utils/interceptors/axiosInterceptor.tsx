import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

export const AxiosInterceptor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Request interceptor - add access token to headers
  axios.interceptors.request.use(
    (request: any) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.log("Access token not detected");
        return request;
      }
      const newHeaders = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      request.headers = newHeaders;
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor - handle token expiration and refresh
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // If error is 403 and token is invalid, try to refresh
      if (error.response?.status === 403 && error.response?.data?.error === "token is invalid" && !originalRequest._retry) {
        if (isRefreshing) {
          // If already refreshing, queue this request
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return axios(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          if (location.pathname !== "/" && location.pathname !== "/login") {
            navigate("/");
          }
          return Promise.reject(error);
        }

        try {
          // Try to refresh the access token
          const { data } = await axios.post("http://localhost:3001/refresh", {
            refreshToken,
          });

          const newAccessToken = data.accessToken;
          localStorage.setItem("accessToken", newAccessToken);

          // Update header and retry original request
          originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
          processQueue(null, newAccessToken);

          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh token is also invalid/expired
          processQueue(refreshError, null);
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          if (location.pathname !== "/" && location.pathname !== "/login") {
            navigate("/");
          }
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      // For other errors, just reject
      return Promise.reject(error);
    }
  );
};