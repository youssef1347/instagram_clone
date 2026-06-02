import axios from "axios";


// axios instance for API calls
const api = axios.create({
    baseURL: 'http://localhost:5000', // backend API URL
    withCredentials: true, // include cookies for authentication
});

export default api;