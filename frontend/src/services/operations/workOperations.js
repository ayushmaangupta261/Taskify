import { toast } from "sonner";
import { apiConnector } from "../apiConnector.js";
import { workEndpoints } from "../endpoints/workEndpoints.js";

// Extract work-related API endpoints
const {
  create_work_api,
  get_all_works_api,
  update_members_api,
  get_work_by_userid
} = workEndpoints;

// Create a new work
export const createWork = (title, description, onSuccess) => async (dispatch) => {
  const toastId = toast.loading("Creating work...");

  try {
    // Call create work API
    const response = await apiConnector(
      "POST",
      create_work_api,
      { title, description }
    );

    if (!response?.data?.success) {
      throw new Error("Create work failed");
    }

    toast.success("Work created successfully", { id: toastId });

    // Optional callback after creation
    if (onSuccess) {
      onSuccess(response.data.work);
    }

    return response.data.work;
  } catch (error) {
    const msg =
      error?.response?.data?.message ||
      "Failed to create work";

    toast.error(msg, { id: toastId });
    return null;
  }
};


//------------------------------------------------------------------------------------------------



// Fetch all works (admin or member-based)
export const getAllWorks = () => async () => {
  try {
    const res = await apiConnector("GET", get_all_works_api);

    if (!res?.data?.success) {
      throw new Error("Failed to fetch works");
    }

    return res.data.works;
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Failed to load works"
    );
    return [];
  }
};



//--------------------------------------------------------------------------------------------------


// Add or remove members from a work
export const updateMembers =
  ({ workId, addEmail, remove = [] }) =>
    async (dispatch) => {
      try {
        // Call update members API
        const res = await apiConnector(
          "PATCH",
          `${update_members_api}/${workId}/members`,
          { addEmail, remove }
        );

        if (!res?.data?.success) {
          throw new Error("Update members failed");
        }

        toast.success("Members updated");

        // Return updated members list
        return res.data.work.members;
      } catch (error) {
        toast.error(
          error?.response?.data?.message || "Failed to update members"
        );
        return null;
      }
    };


//------------------------------------------------------------------------------------------------------



// Fetch works assigned to a specific user
export const getWorksByUserId = (userId) => async () => {
  try {
    const res = await apiConnector(
      "GET",
      `${get_work_by_userid}/${userId}`
    );

    if (!res?.data?.success) {
      throw new Error("Failed to fetch user works");
    }

    return res.data.works;
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
      "Failed to load user works"
    );
    return [];
  }
};
