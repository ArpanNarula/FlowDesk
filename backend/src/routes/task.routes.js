const express = require("express");
const { body } = require("express-validator");
const { getTasks, createTask, getTask, updateTask, deleteTask } = require("../controllers/task.controller");
const { protect } = require("../middleware/auth.middleware");
const { handleValidation } = require("../middleware/validate.middleware");

const router = express.Router();

// All task routes are protected
router.use(protect);

router.get("/", getTasks);
router.get("/:id", getTask);

router.post(
  "/",
  [
    body("title").trim().notEmpty().withMessage("Title is required").isLength({ max: 120 }),
    body("status").optional().isIn(["todo", "in_progress", "in_review", "done"]),
    body("priority").optional().isIn(["low", "medium", "high", "urgent"]),
  ],
  handleValidation,
  createTask
);

router.put(
  "/:id",
  [
    body("title").optional().trim().notEmpty().isLength({ max: 120 }),
    body("status").optional().isIn(["todo", "in_progress", "in_review", "done"]),
    body("priority").optional().isIn(["low", "medium", "high", "urgent"]),
  ],
  handleValidation,
  updateTask
);

router.delete("/:id", deleteTask);

module.exports = router;
