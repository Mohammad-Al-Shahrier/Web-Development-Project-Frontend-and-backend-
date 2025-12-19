import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({
    message: "Login successful",
    userId: user._id,
    name: user.name,
    email: user.email,
  });
};
