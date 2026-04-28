const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    color: {
      type: String,
      default: "#6366f1",
      match: [/^#[0-9A-Fa-f]{6}$/, "Please enter a valid hex color"],
    },
    icon: { type: String, default: "folder" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "on_hold", "completed", "archived"],
      default: "active",
    },
    dueDate: { type: Date },
    // Computed stats (updated on task changes)
    taskCount: { type: Number, default: 0 },
    completedTaskCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

projectSchema.index({ owner: 1, status: 1 });

module.exports = mongoose.model("Project", projectSchema);
