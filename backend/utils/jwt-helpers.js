const jwt = require("jsonwebtoken");

const jwtTokens = ({ user_id, username, email }) => {
  const user = { user_id, username, email };
  const accessToken = jwt.sign(user, process.env.TOKEN_SECRET, {
    expires: "24h",
  });
  return accessToken;
};

module.exports = jwtTokens;
