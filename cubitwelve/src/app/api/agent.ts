import axios, {AxiosResponse} from "axios";
import { config } from "yargs";

const API_PORT = 5000;
const token = "";
axios.defaults.baseURL = `http://localhost:${API_PORT}/api/`;
axios.defaults.withCredentials = true;
axios.interceptors.request.use
(config => {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});
const response_body = (response: AxiosResponse) => response.data;

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(response_body),
    post: (url: string, body: {}) => axios.post(url, body).then(response_body),
    put: (url: string, body: {}) => axios.put(url, body).then(response_body),
    delete: (url: string) => axios.delete(url).then(response_body),
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