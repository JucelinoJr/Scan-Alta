import axios from "axios";

const api = axios.create({
    baseURL: 'API',
});
export default api;