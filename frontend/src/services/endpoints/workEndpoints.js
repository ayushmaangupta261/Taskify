const BASE_URL = import.meta.env.VITE_APP_BASE_URL;



export const workEndpoints = {
    create_work_api: BASE_URL + "/api/v1/works/create-work",
    get_all_works_api: BASE_URL + "/api/v1/works/get-all-works",
    update_members_api: BASE_URL + "/api/v1/works",

    get_work_by_userid: BASE_URL + "/api/v1/works/get-work-by-userid"
};
