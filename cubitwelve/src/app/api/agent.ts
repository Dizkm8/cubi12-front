import axios, {AxiosResponse} from "axios";
import { config } from "yargs";

const API_PORT = 5000;
const token = "eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJkYXZpZC5hcmF5YUBhbHVtbm9zLnVjbi5jbCIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6InN0dWRlbnQiLCJleHAiOjE2OTk2MzUzODR9.Tmk4WQ-Bfs4ZMVGxhg1xlrT6_fLqhbWpJRHa2v-ksTs";
axios.defaults.baseURL = `http://localhost:${API_PORT}/api/`;
axios.defaults.withCredentials = true;
axios.interceptors.request.use
(config => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});
const responseBody = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Auth = {
    register : (form: any) => requests.post("auth/register", form), // TODO: Fix if needed
    login : (form: any) => requests.post("auth/login", form), // TODO: Fix if needed
    updatePassword : (form: any) => requests.put("auth/update-password", form), // TODO: Fix if needed
    updateProfile: (form: any) => requests.put("users/update-profile", form), // TODO: Fix if needed
    profile: () => requests.get("users/profile"), // TODO: Fix if needed
}


const agent = { Auth, requests };

export default agent;