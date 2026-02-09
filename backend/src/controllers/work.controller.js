const Work = require("../models/Work.js");
const Task = require("../models/Task.js");
const User = require("../models/User.js");
const getLogger = require("../config/logger");
const logger = getLogger("work");


// Controller using which admin can create the work for users (admin only)
exports.createWork = async (req, res, next) => {
  try {
    // Log incoming create work request
    logger.info("Create work request", {
      userId: req.user.id,
      body: req.body
    });

    // Restrict work creation to admin users
    if (req.user.role !== "admin") {
      logger.warn("Unauthorized createWork attempt", {
        userId: req.user.id
      });
      return res.status(403).json({ message: "Access denied" });
    }

    // Extract work details from request body
    const { title, description } = req.body;

    // Create new work entry
    const work = await Work.create({
      title,
      description,
      createdBy: req.user.id
    });

    // Log successful work creation
    logger.info("Work created successfully", {
      workId: work._id,
      createdBy: req.user.id
    });

    // Return created work
    res.status(201).json({
      success: true,
      work
    });
  } catch (error) {
    // Log error details
    logger.error("Error creating work", {
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};


// --------------------------------------------------------------------------------


// controller to add/remove users from the work (admin only)
exports.updateMembers = async (req, res, next) => {
  try {
    // Log incoming update members request
    logger.info("Update members request", {
      userId: req.user.id,
      workId: req.params.workId,
      body: req.body
    });

    // Restrict member updates to admin users
    if (req.user.role !== "admin") {
      logger.warn("Unauthorized updateMembers attempt", {
        userId: req.user.id
      });
      return res.status(403).json({ message: "Access denied" });
    }

    // Extract work identifier and update payload
    const { workId } = req.params;
    const { addEmail, remove = [] } = req.body;

    // Fetch work record
    const work = await Work.findById(workId);
    if (!work) {
      logger.warn("Work not found in updateMembers", { workId });
      return res.status(404).json({ message: "Work not found" });
    }

    // Track member count before changes
    const membersBefore = work.members.length;

    
    // Add member by email
    let addIds = [];
    if (addEmail) {
      const user = await User.findOne({ email: addEmail });
      if (!user) {
        logger.warn("User not found while adding member", { addEmail });
        return res.status(404).json({ message: "User not found" });
      }
      addIds.push(user._id);
    }

    
    // Remove members and tasks
    const removedUserIds = remove.map(id => id.toString());

    if (removedUserIds.length > 0) {
      const deleted = await Task.deleteMany({
        workId,
        assignedTo: { $in: removedUserIds }
      });

      // Log task cleanup for removed members
      logger.info("Tasks deleted for removed members", {
        workId,
        removedUserIds,
        deletedCount: deleted.deletedCount
      });
    }


    // Update members array
    work.members = work.members
      .filter(id => !removedUserIds.includes(id.toString()))
      .concat(addIds.filter(id => !work.members.includes(id)));


    // Update status on first member add
    if (
      membersBefore === 0 &&
      work.members.length > 0 &&
      work.status === "pending"
    ) {
      work.status = "in_progress";

      logger.info("Work status updated to in_progress (first member added)", {
        workId
      });
    }

    // Persist work updates
    await work.save();

    // Fetch updated work with member details
    const updatedWork = await Work.findById(workId)
      .populate("members", "name email");

    // Log successful member update
    logger.info("Members updated successfully", {
      workId,
      membersCount: updatedWork.members.length,
      status: updatedWork.status
    });

    return res.json({
      success: true,
      work: updatedWork
    });

  } catch (error) {
    // Log unexpected errors
    logger.error("Error updating members", {
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};


// ---------------------------------------------------------------------------------


// To get detail of a prticular work (admin only)
exports.getWorkDetails = async (req, res, next) => {
  try {
    // Extract work identifier from request params
    const { workId } = req.params;

    // Log incoming work details request
    logger.info("Get work details request", {
      workId,
      userId: req.user.id
    });

    // Fetch work with related member and creator details
    const work = await Work.findById(workId)
      .populate("members", "name email")
      .populate("createdBy", "name email");

    // Handle missing work record
    if (!work) {
      logger.warn("Work not found in getWorkDetails", { workId });
      return res.status(404).json({ message: "Work not found" });
    }

    // Fetch tasks associated with the work
    const tasks = await Task.find({ workId }).populate(
      "assignedTo",
      "name email"
    );

    // Log successful data fetch
    logger.info("Work details fetched", {
      workId,
      tasksCount: tasks.length
    });

    // Return work and task details
    res.json({
      success: true,
      work,
      tasks
    });
  } catch (error) {
    // Log unexpected errors
    logger.error("Error fetching work details", {
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};


// ----------------------------------------------------------------------------------


// Handles fetching work records  (admin only)
exports.getAllWorks = async (req, res, next) => {
  try {
    // Log incoming request
    logger.info("Get all works request", {
      userId: req.user.id
    });

    // Fetch authenticated user
    const user = await User.findById(req.user.id);

    // Handle missing user
    if (!user) {
      logger.warn("User not found in getAllWorks", {
        userId: req.user.id
      });
      return res.status(401).json({ message: "User not found" });
    }

    // Build query based on user role
    let query = {};
    if (user.role !== "admin") {
      query.members = user._id;
    }

    // Fetch works with related user details
    const works = await Work.find(query)
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    // Log successful fetch
    logger.info("Works fetched successfully", {
      userId: req.user.id,
      count: works.length
    });

    // Return works list
    res.json({
      success: true,
      count: works.length,
      works
    });
  } catch (error) {
    // Log unexpected errors
    logger.error("Error fetching works", {
      message: error.message,
      stack: error.stack
    });
    next(error);
  }
};


// ---------------------------------------------------------------------------------


// Fetches all works assigned to a specific user (user)
exports.getWorksByUserId = async (req, res, next) => {
  try {
    // Extract target userId from route params
    const { userId } = req.params;

    // Debug log for incoming params
    console.log("user -> ", req.params);

    // Log incoming request details
    logger.info("Get works by user request", {
      userId,
      requestedBy: req.user?.id
    });

    // Validate user existence
    const userExists = await User.findById(userId);
    if (!userExists) {
      logger.warn("User not found in getWorksByUserId", { userId });
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Fetch works where user is a member
    const works = await Work.find({
      members: userId
    })
      .populate("createdBy", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    // Log successful fetch
    logger.info("Works fetched for user", {
      userId,
      workCount: works.length
    });

    // Return works list
    return res.status(200).json({
      success: true,
      count: works.length,
      works
    });
  } catch (error) {
    // Log unexpected errors
    logger.error("Error fetching works by user", {
      message: error.message,
      stack: error.stack,
      userId: req.params.userId
    });
    next(error);
  }
};
