require("dotenv").config();
const serverPort = process.env.SERVER_PORT || 4001;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerceAI";
const userImagePath =
  process.env.USER_IMAGE_PATH || "public/images/users/images.png";
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY;
const smtpUsername = process.env.SMTP_USERNAME;
const smtpPassword = process.env.SMTP_PASSWORD;
const clientURL = process.env.CLIENT_URL;

module.exports = {
  serverPort,
  MONGODB_URI,
  userImagePath,
  jwtActivationKey,
  smtpPassword,
  smtpUsername,
  clientURL,
};
