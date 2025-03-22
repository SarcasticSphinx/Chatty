import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    full_name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profile_pic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const user_model = mongoose.model("User", userSchema);

export default user_model;
