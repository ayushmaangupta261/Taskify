const router = require("express").Router();
const auth = require("../middleware/auth.middleware");

const {
  createWork,
  updateMembers,
  getWorkDetails,
  getAllWorks,
  getWorksByUserId
} = require("../controllers/work.controller");

// Work routes

// POST /api/v1/works/create-work – Create a new work (admin)
router.post(
  "/create-work",
  auth,
  createWork
);


//-------------------------------------------------------------------



// GET /api/v1/works/get-all-works – Get all works (admin)
router.get(
  "/get-all-works",
  auth,
  getAllWorks
);


//-------------------------------------------------------------------



// GET /api/v1/works/get-work-by-userid/:userId – Get works assigned to a user
router.get(
  "/get-work-by-userid/:userId",
  auth,
  getWorksByUserId
);


//------------------------------------------------------------------------------------



// PATCH /api/v1/works/:workId/members – Add or remove work members (admin)
router.patch(
  "/:workId/members",
  auth,
  updateMembers
);


//------------------------------------------------------------------------------------------


// GET /api/v1/works/:workId – Get work details
router.get(
  "/:workId",
  auth,
  getWorkDetails
);

module.exports = router;
