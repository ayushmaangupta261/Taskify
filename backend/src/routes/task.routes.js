const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

const {
  createTask,
  updateTaskStatus,
  getTasksByWorkId,
  getUserTasksByWork
} = require("../controllers/task.controller");

// Task routes

// POST /api/v1/tasks/create-task – Create a new task (admin)
router.post(
  "/create-task",
  auth,
  createTask
);


//---------------------------------------------------------------------


// GET /api/v1/tasks/get-user-task-by-work/:workId – Get logged-in user's tasks for a work
router.get(
  "/get-user-task-by-work/:workId",
  auth,
  getUserTasksByWork
);


//-----------------------------------------------------------------------


// PATCH /api/v1/tasks/status/:taskId – Update task status
router.patch(
  "/status/:taskId",
  auth,
  updateTaskStatus
);


//-------------------------------------------------------------------------


// GET /api/v1/tasks/:workId – Get all tasks for a work (admin)
router.get(
  "/:workId",
  auth,
  getTasksByWorkId
);

module.exports = router;
