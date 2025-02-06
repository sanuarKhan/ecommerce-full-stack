const jwt = require("jsonwebtoken");

const createJSONWebToken = (playload, secretKey, expiresIn) => {
  if (typeof playload != "object" || !playload) {
    throw new Error("playload must be a non-empty object");
  }
  if (typeof secretKey != "string" || secretKey == "") {
    throw new Error("secretkey  must be a non-empty string");
  }

  try {
    const token = jwt.sign(playload, secretKey, { expiresIn });

    return token;
  } catch (error) {
    console.error("failed to sing the JWT", error);
    throw error;
  }
};

module.exports = createJSONWebToken;
