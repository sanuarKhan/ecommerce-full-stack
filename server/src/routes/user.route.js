const express = require("express");
const {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
} = require("../controllers/user.controller");
const upload = require("../middleware/uploadFiles");
const runValidation = require("../validator");
const { validateUserRegistation } = require("../validator/auth");

const userRouter = express.Router();

userRouter.post(
  "/process-register",
  upload.single("image"),
  validateUserRegistation,
  runValidation,
  processRegister
);
userRouter.post("/verify", activateUserAccount);
userRouter.get("/", getUsers);
userRouter.get("/:id", getUserById);
userRouter.delete("/:id", deleteUserById);

module.exports = userRouter;
