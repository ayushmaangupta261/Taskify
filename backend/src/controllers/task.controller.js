const Task = require("../models/Task.js");
const Work = require("../models/Work.js");
const User = require("../models/User.js");
const getLogger = require("../config/logger.js");
const { log } = require("winston");

const logger = getLogger("task");

const STATUS_FLOW = {
  pending: ["accepted"],
  accepted: ["in_progress"],
  in_progress: ["completed"],
  completed: []
};


// Only admin can create the tasks
exports.createTask = async (req, res, next) => {
  try {
    // Log incoming create task request
    logger.info("Create task request", {
      userId: req.user.id,
      body: req.body
    });

    // Restrict task creation to admin users
    if (req.user.role !== "admin") {
      logger.warn("Unauthorized createTask attempt", {
        userId: req.user.id
      });
      return res.status(403).json({ message: "Access denied" });
    }

    // Extract task details from request body
    const { title, description, workId, assignedTo } = req.body;

    // Create a new task entry
    const task = await Task.create({
      title,
      description,
      workId,
      assignedTo
    });

    // Log successful task creation
    logger.info("Task created", {
      taskId: task._id,
      workId,
      assignedTo
    });

    // Update related work status
    await Work.findByIdAndUpdate(workId, {
      status: "in_progress"
    });

    // Log work status update
    logger.info("Work status updated to in_progress", {
      workId
    });

    // Return created task
    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    // Log error details
    logger.error("Error creating task", {
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};


//------------------------------------------------------------------------------------------

// This is a controller for admin such that they can get deatils of the work they have created
exports.getTasksByWorkId = async (req, res, next) => {
  try {
    // Extract workId from route params
    const { workId } = req.params;

    // Log incoming fetch request
    logger.info("Get tasks by workId request", {
      workId,
      userId: req.user.id
    });

    // Fetch tasks linked to the given workId
    const tasks = await Task.find({ workId })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    // Log fetch result count
    logger.info("Tasks fetched for work", {
      workId,
      count: tasks.length
    });

    // Return task list
    return res.status(200).json({
      success: true,
      tasks
    });
  } catch (error) {
    // Log error details
    logger.error("Error fetching tasks by workId", {
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};



// ---------------------------- controller for users ----------------------------------------

// This controller returns the tasks of a user
exports.getUserTasksByWork = async (req, res, next) => {
  try {
    // Extract workId from params and userId from auth context
    const { workId } = req.params;
    const userId = req.user.id;

    // Debug log for incoming identifiers
    console.log("work and user -> ", workId);

    // Log incoming request details
    logger.info("Get user tasks by work request", {
      workId,
      userId,
      requestedBy: req.user?.id
    });

    // Verify work exists
    const workExists = await Work.findById(workId);
    if (!workExists) {
      logger.warn("Work not found in getUserTasksByWork", { workId });
      return res.status(404).json({
        success: false,
        message: "Work not found"
      });
    }

    // Debug log for fetched work
    console.log("work -> ", workExists);

    // Verify user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      logger.warn("User not found in getUserTasksByWork", { userId });
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Debug log for fetched user
    console.log("user -> ", userExists);

    // Fetch tasks assigned to the user for the given work
    const tasks = await Task.find({
      workId: workExists._id,
      assignedTo: userExists._id
    })
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 });

    // Debug log for fetched tasks
    console.log("tasks -> ", tasks);

    // Log successful task fetch
    logger.info("User tasks fetched successfully", {
      workId,
      userId,
      taskCount: tasks.length
    });

    // Debug log before response
    console.log("task -> ", tasks);

    // Return tasks response
    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    // Log error details
    logger.error("Error fetching user tasks by work", {
      message: error.message,
      stack: error.stack,
      workId: req.params.workId,
      userId: req.params.userId
    });
    next(error);
  }
};


//----------------------------------------------------------------------------------------------


// Ccntorller for users to udate the status of the tasks assigned to them
exports.updateTaskStatus = async (req, res, next) => {
  try {
    // Extract task identifier and new status
    const { taskId } = req.params;
    const { status } = req.body;

    // Log incoming status update request
    logger.info("Update task status request", {
      userId: req.user.id,
      taskId,
      status
    });

    // Validate status presence
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    // Validate allowed status values
    if (!["pending", "accepted", "in_progress", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Fetch task by ID
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Ensure only assigned user can update the task
    if (task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not your task" });
    }

    // Update task status
    task.status = status;
    await task.save();

    // Log task status update
    logger.info("Task status updated", {
      taskId,
      newStatus: status
    });

    
    // Auto-update related work status
    
    const workId = task.workId;

    // Calculate task metrics for work
    const totalTasks = await Task.countDocuments({ workId });
    const completedTasks = await Task.countDocuments({
      workId,
      status: "completed"
    });
    const assignedTasks = await Task.countDocuments({
      workId,
      assignedTo: { $exists: true }
    });

    // Determine new work status
    let newWorkStatus = "pending";

    if (assignedTasks === 0) {
      newWorkStatus = "pending";
    } else if (completedTasks === totalTasks && totalTasks > 0) {
      newWorkStatus = "completed";
    } else {
      newWorkStatus = "in_progress";
    }

    // Update work status
    await Work.findByIdAndUpdate(workId, {
      status: newWorkStatus
    });

    // Log automatic work status update
    logger.info("Work status updated automatically", {
      workId,
      status: newWorkStatus,
      totalTasks,
      completedTasks,
      assignedTasks
    });

    // Return updated task and work status
    return res.json({
      success: true,
      task,
      workStatus: newWorkStatus
    });
  } catch (error) {
    // Log unexpected errors
    logger.error("Error updating task status", {
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};
