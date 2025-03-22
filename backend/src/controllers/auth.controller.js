import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utlis.js";
import user_model from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const handleSignUp = async (req, res) => {
  const { full_name, email, password } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "password must contain at least 6 characters" });
    }
    const user = await user_model.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "user already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new user_model({
      full_name: full_name,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate a jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        id: newUser._id,
        full_name: newUser.full_name,
        email: newUser.email,
        profile_pic: newUser.profile_pic,
        message: "new user created successfully",
      });
    } else {
      return res.status(400).json({ message: "Invalid User Data" });
    }
  } catch (error) {
    console.log(
      `Internal server error at handleSignUp controller: ${error.message}`
    );
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const handleLogIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await user_model.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      generateToken(user._id, res);
      return res.status(200).json({
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        profile_pic: user.profile_pic,
        message: "User logged in successfully",
      });
    } else {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(
      `Internal server error at handleLogIn controller: ${error.message}`
    );
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const handleLogOut = async (req, res) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });

  return res.status(200).json({
    message: "user log out successfully",
  });
};

export const handleUpdateProfile = async (req, res) => {
  try {
    const { profile_pic } = req.body;
    const userId = req.user._id;

    if (!profile_pic) {
      return res.status(400).json({ message: "Profile picture not provided" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profile_pic);
    const updatedUser = await user_model
      .findByIdAndUpdate(
        userId,
        { profile_pic: uploadResponse.secure_url },
        { new: true }
      )
      .select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log(
      `Internal server error at updateProfilePic controller: ${error.message}`
    );
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const checkAuth = (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log(
      `Internal server error at checkAuth controller: ${error.message}`
    );
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
