import axios from "axios";
import EnvManager from '../config/envManager';
import { authInterceptor } from '../interceptors/auth.interceptor';

const backend = axios.create({
    baseURL: EnvManager.BACKEND_URL,
});


backend.interceptors.request.use(authInterceptor);

const getUsers = async () => {
    try {
        const response = await backend.get('/users')
        return response?.data;
    }
    catch (error) {
        return null;
    }
};

export {
    getUsers,
};