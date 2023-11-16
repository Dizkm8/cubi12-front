import axios, {AxiosResponse} from "axios";

let token = localStorage.getItem("token");

// const API_PORT = 80;
// axios.defaults.baseURL = `http://localhost:${API_PORT}/api/`;
axios.defaults.baseURL = process.env.REACT_APP_API_URL
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
    register : (form: any) => requests.post("auth/register", form).then(response => token = response.token),
    login : (form: any) => requests.post("auth/login", form).then(response => token = response.token),
    updatePassword : (form: any) => requests.put("auth/update-password", form),
    updateProfile: (form: any) => requests.put("users/update-profile", form),
    profile: () => requests.get("users/profile"),
}

const agent = { Auth, requests, token };

export default agent;
