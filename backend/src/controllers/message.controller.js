import user_model from "../models/user.model.js";
import message_model from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io } from "../lib/socket.js";
import { getReceiverSocketId } from "../lib/socket.js";

export const getUserForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await user_model
      .find({ _id: { $ne: loggedInUserId } })
      .select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log(
      "Internal server error in getUserForSideBar Controller: ",
      error.message
    );
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const getMessages = async (req, res) => {
  try {
    const userToChat = req.params.id;
    const myId = req.user._id;

    const messages = await message_model.find({
      $or: [
        { senderId: userToChat, receiverId: myId },
        { senderId: myId, receiverId: userToChat },
      ],
    });
    return res.status(200).json(messages);
  } catch (error) {
    console.log(
      "Internal server error in getMessages Controller: ",
      error.message
    );
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new message_model({
      senderId: senderId,
      receiverId: receiverId,
      text: text,
      image: imageUrl,
    });

    await newMessage.save();
    res.status(200).json(newMessage);

    //realtime funtionality goes here with socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
  } catch (error) {
    console.log(
      "Internal server error in sendMessage Controller: ",
      error.message
    );
    res.status(500).json({
      message: "Internal Server error",
    });
  }
};
