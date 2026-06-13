import axios from "axios";


// axios instance for API calls
const api = axios.create({
    baseURL: 'http://localhost:5000', // backend API URL
    withCredentials: true, // include cookies for authentication
});


// send token with every request by axios interceptors
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }


    return config;
}, (error) => {
    return Promise.reject(error);
});

// Set the access token in the request headers for authenticated requests
api.interceptors.response.use(
    (response) => {

        return response;
    }, async (error) => {
        try {
            console.log(error);

            // navigate the user to login page if there is no refresh token provided
            if (error.response?.data?.message === 'no refresh token provided') {
                // logout user
                localStorage.removeItem('accessToken');
                await api.post('api/auth/logout');
                // redirect to login page
                window.location.href = '/login';
                return Promise.reject(error);
            } else if (error.response?.status === 401) {
                // generate new access token
                const response = await api.post("api/auth/refresh-token");
                const { accessToken } = response.data;
                // store new access token in local storage
                localStorage.setItem('accessToken', accessToken);
                window.dispatchEvent(new Event("auth-token-changed"));
                // retry original request with new access token
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return api.request(error.config);
            } else {
                // Return other errors
                return Promise.reject(error);
            }
        } catch (error) {
            return Promise.reject(error);
        }

    }
);

export default api;
