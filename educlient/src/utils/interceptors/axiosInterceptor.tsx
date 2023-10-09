import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

export const AxiosInterceptor = () => {
 

  axios.interceptors.request.use((request:any) => {
    console.log("interceptor working")
    const token = localStorage.getItem("token")
    if(!token) return request;
    const newHeaders = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      request.headers = newHeaders;
    return request;
    
    
  });

  
};