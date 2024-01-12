const { User } = require("../models");
const jwt = require("jsonwebtoken");

exports.authentication = async (req, res) => {
  try {
    const { ssoToken, name, email, avatarURL, roleID } = req.body;

    if (!ssoToken) {
      throw new Error("JWT must be provided");
    }

    // Verify the JWT token
    const user = jwt.verify(ssoToken, "e389bb7b-dc58-4b0b-8f54-dac159d5a609");

    // Check if the user exists in the database
    const [existingUser, created] = await User.findOrCreate({
      where: { id: user.id },
      defaults: {
        name: user.name,
        email: user.email,
        avatarURL: user.avatarURL,
        token: ssoToken,
        roleID: 1,
      },
    });

    // If the user already exists, update their information
    if (!created) {
      await User.update(
        {
          name: name || user.name,
          email: email || user.email,
          avatarURL: avatarURL || user.avatarURL,
          token: ssoToken,
          roleID: 1, 
        },
        { where: { id: user.id } }
      );
    }

    // Respond with the user information
    res.json(existingUser);
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
