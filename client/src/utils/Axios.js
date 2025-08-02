import axios from "axios";
import SummaryApi from "../common/SummaryApi";

const baseURL = "http://localhost:8080"; // ya import.meta.env.VITE_API_URL

const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

// Request interceptor
Axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accesstoken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for refresh token
Axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    let originRequest = error.config;

    if (error.response?.status === 401 && !originRequest._retry) {
      originRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        const newAccessToken = await refreshAccessToken(refreshToken);
        if (newAccessToken) {
          originRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return Axios(originRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);

const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await axios({
      ...SummaryApi.refreshToken,
      baseURL: baseURL,
      headers: { Authorization: `Bearer ${refreshToken}` }
    });

    const accessToken = response.data.data.accessToken;
    localStorage.setItem("accesstoken", accessToken);
    return accessToken;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default Axios;
