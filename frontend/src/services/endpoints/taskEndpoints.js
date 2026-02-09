const BASE_URL = import.meta.env.VITE_APP_BASE_URL;



export const taskEndpoints = {
    create_task_api: BASE_URL + "/api/v1/tasks/create-task",
    get_task_by_work_id_api: BASE_URL + "/api/v1/tasks",
    get_user_task_by_work: BASE_URL + "/api/v1/tasks/get-user-task-by-work",
    update_status: BASE_URL + "/api/v1/tasks/status"
};
