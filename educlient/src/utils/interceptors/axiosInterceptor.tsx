import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export const AxiosInterceptor = () => {
  const navigate = useNavigate();
  const location = useLocation()

  axios.interceptors.request.use((request:any) => {
    const token = localStorage.getItem("token")
    if(!token) {
        console.log("token not detected")
        return request;
    }
    const newHeaders = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      request.headers = newHeaders;
    return request;
    
    
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if(error.response.data.error === "token is invalid" && location.pathname !== "/" && location.pathname !== "/login"){
        navigate("/")
        //window.location.replace("/");
      }
      return Promise.reject(error);
    }
  );

  
};