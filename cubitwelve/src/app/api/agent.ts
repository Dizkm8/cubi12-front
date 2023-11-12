import axios, {AxiosResponse} from "axios";

const API_PORT = 5000;
let token = localStorage.getItem("token");
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
    register : (form: any) => requests.post("auth/register", form).then(response => token = response.token), // TODO: Fix if needed
    login : (form: any) => requests.post("auth/login", form).then(response => token = response.token), // TODO: Fix if needed
    updatePassword : (form: any) => requests.put("auth/update-password", form), // TODO: Fix if needed
    updateProfile: (form: any) => requests.put("users/update-profile", form), // TODO: Fix if needed
    profile: () => requests.get("users/profile"), // TODO: Fix if needed
}

const agent = { Auth, requests, token };

export default agent;
