const express = require("express");
const { body } = require("express-validator");
const { getProjects, createProject, updateProject, deleteProject, getProjectTasks } = require("../controllers/project.controller");
const { protect } = require("../middleware/auth.middleware");
const { handleValidation } = require("../middleware/validate.middleware");

const router = express.Router();

router.use(protect);

router.get("/", getProjects);
router.post(
  "/",
  [
    body("name").trim().notEmpty().withMessage("Project name is required").isLength({ max: 80 }),
    body("color").optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage("Invalid hex color"),
  ],
  handleValidation,
  createProject
);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.get("/:id/tasks", getProjectTasks);

module.exports = router;
