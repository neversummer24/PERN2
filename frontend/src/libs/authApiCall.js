import axios from "axios";

const API_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
    baseURL: API_URL,
});

//set token for api calls
export const setAuthToken = (token) => {
    if (token) {
        console.log("token set:"+token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common["Authorization"];
    }
}

export default api;