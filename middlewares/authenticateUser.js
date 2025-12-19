import User from "../models/user.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const userId = req.headers["user-id"];

    if (!userId) {
      return res.status(401).json({ message: "User ID missing" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
