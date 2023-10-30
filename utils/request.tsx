import axios from 'axios';
import { AUTH_DOMAIN } from 'constant';
import { toast } from "react-toastify";

const request = axios.create({
  baseURL: AUTH_DOMAIN,
  timeout: 10000,
  withCredentials: true,
});

const addAuthorizationHeader = (config) => {
  let token: any;
  if (typeof window !== "undefined") {
    token = window.localStorage.getItem("auth");
  }
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8;',
    };
  }
  return config;
};

const handleErrorResponse = (error) => {
  if (error.response.status === 403) {
    toast(error.response.data.message, { hideProgressBar: true, autoClose: 2000, type: 'error', position: 'top-right' })
    setTimeout(() => {
      window.location.href = encodeURI(location.href);
    }, 1000);
  }
  return Promise.reject(error.response);
};

request.interceptors.request.use(addAuthorizationHeader);
request.interceptors.response.use((response) => response, handleErrorResponse);
export default request;
