const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const { successResponse } = require("./responseController");
const mongoose = require("mongoose");

const { findWithId } = require("../service/findItem");
const deleteImage = require("../helper/deleteImage");
const createJSONWebToken = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientURL } = require("../secret");
const emailWithNodeMailer = require("../helper/email");

const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(".*" + search + ".*", "i");
    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegex } },
        { email: { $regex: searchRegex } },
        { phone: { $regex: searchRegex } },
      ],
    };
    const options = { password: 0 };

    const users = await User.find(filter, options).skip(skip).limit(limit);

    const count = await User.countDocuments(filter).countDocuments();

    if (!users) throw createError("No users found");

    return successResponse(res, {
      statusCode: 200,
      message: "users were returned",
      playload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page > 1 ? page - 1 : null,
          nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "user were returned",
      playload: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;
    deleteImage(userImagePath);

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponse(res, {
      statusCode: 200,
      message: "user was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // const imageBufferString = req.file.buffer.toString("base64");

    // Check if user already exists
    const userExists = await User.exists({ email });
    if (userExists) {
      return next(
        createError(
          409,
          "User already exists with this email ID. Please log in."
        )
      );
    }

    // Create JWT token for account activation
    const token = createJSONWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "30m"
    );

    // Prepare email data
    const emailData = {
      email,
      subject: "Account Activation Mail",
      html: `
        <h2>Hello ${name}!</h2>
        <p>Please click <a href="${clientURL}/api/v1/users/activate/${token}" target="_blank">here</a> to activate your account.</p>
      `,
    };

    //Send email using nodemailer
    try {
      await emailWithNodeMailer(emailData);
    } catch (mailError) {
      next(createError(500, "Failed to send verification email."));
      return;
    }

    // Respond with success message
    return successResponse(res, {
      statusCode: 200,
      message: `Please check your email (${email}) to activate your account.`,
      playload: { token },
    });
  } catch (error) {
    next(error);
  }
};

const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "token not found");
    try {
      const decoded = jwt.verify(token, jwtActivationKey);
      if (!token) throw createError(401, "user is not allow to verify");
      const userExists = await User.exists({ email: decoded.email });
      if (userExists) {
        throw createError(
          409,
          "user already exists with this email Id. Please log in"
        );
      }

      User.create(decoded);

      return successResponse(res, {
        statusCode: 200,
        message: `User was register successfully`,
      });
    } catch (error) {
      if (error.name == "TokenExpiredError") {
        throw createError(401, "Token has expired");
      } else if (error.name == "JsonWebTokenError") {
        throw createError(401, "Invalid Token");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  deleteUserById,
  processRegister,
  activateUserAccount,
};
