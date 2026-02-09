const BASE_URL = import.meta.env.VITE_APP_BASE_URL;



export const authEnpoint = {
    login_api: BASE_URL + "/api/v1/auth/login",
    register_api: BASE_URL + "/api/v1/auth/register"
};
