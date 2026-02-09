import { toast } from "sonner";
import { apiConnector } from "../apiConnector";
import { taskEndpoints } from "../endpoints/taskEndpoints.js";

// Destructure task-related API endpoints
const {
  create_task_api,
  get_task_by_work_id_api,
  get_user_task_by_work,
  update_status
} = taskEndpoints;

// Create a new task
export const createTask =
  ({ title, description, workId, assignedTo }, onSuccess) =>
    async () => {
      const toastId = toast.loading("Creating task...");

      try {
        // Call create task API
        const response = await apiConnector(
          "POST",
          create_task_api,
          {
            title,
            description,
            workId,
            assignedTo
          }
        );

        if (!response?.data?.success) {
          throw new Error("Create task failed");
        }

        toast.success("Task created successfully", { id: toastId });

        // Optional callback to update UI
        if (onSuccess) {
          onSuccess(response.data.task);
        }

        return response.data.task;
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          "Failed to create task";

        toast.error(msg, { id: toastId });
        return null;
      }
    };


//----------------------------------------------------------------------------------------------



// Fetch all tasks for a specific work
export const getTasksByWorkId =
  (workId) =>
    async () => {
      const toastId = toast.loading("Loading tasks...");

      try {
        // Call fetch tasks API
        const response = await apiConnector(
          "GET",
          `${get_task_by_work_id_api}/${workId}`
        );

        console.log("Task by work -> ", response);

        if (!response?.data?.success) {
          throw new Error("Fetch tasks failed");
        }

        toast.dismiss(toastId);

        // Return tasks list
        return response.data.tasks;
      } catch (error) {
        const msg =
          error?.response?.data?.message ||
          "Failed to fetch tasks";

        toast.error(msg, { id: toastId });
        return [];
      }
    };


// ----------------------------------------------------------------------------------------------------



// Fetch tasks assigned to the logged-in user for a work
export const getUserTasksByWork =
  ({ workId, userId }) =>
    async () => {
      try {
        // Call user-specific tasks API
        const res = await apiConnector(
          "GET",
          `${get_user_task_by_work}/${workId}/`
        );

        if (!res?.data?.success) {
          throw new Error("Failed to fetch tasks");
        }

        return res.data.tasks;
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
          "Failed to load tasks"
        );
        return [];
      }
    };


//-------------------------------------------------------------------------------------------------------------



// Update status of a task
export const updateTaskStatus =
  ({ taskId, status }) =>
    async () => {
      try {
        // Call update status API
        const res = await apiConnector(
          "PATCH",
          `${update_status}/${taskId}`,
          { status }
        );

        if (!res?.data?.success) {
          throw new Error("Status update failed");
        }

        return res.data.task;
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update task"
        );
        return null;
      }
    };
