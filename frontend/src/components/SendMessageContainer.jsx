import React from "react";
import { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, SendHorizontal } from "lucide-react";
import toast from "react-hot-toast";

const SendMessageContainer = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const imageRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text && !image) {
      return;
    }
    try {
      await sendMessage({ text: text.trim(), image });
      setText("");
      setImage(null);
      if (imageRef.current) {
        imageRef.current.value = "";
      }
    } catch (error) {
      toast.error("Error sending message");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image")) {
      toast.error("Please upload an image");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImg = () => {
    setImage(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  return (
    <div>
      {image && (
        <div className="flex flex-col items-center justify-center relative w-1/6 h-auto border rounded-lg shadow-lg bg-base-100">
          <img
            src={image}
            alt="Uploaded preview"
            className="w-full h-auto rounded-md object-cover"
          />
          <button
            onClick={removeImg}
            className="px-3 py-2 absolute rounded-full bg-red-500 text-white top-2 right-2 cursor-pointer"
          >
            ✖
          </button>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-base-200 chat-footer"
      >
        <input
          type="text"
          placeholder="Type your message"
          className="input input-bordered w-full"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="file"
          className="hidden"
          ref={imageRef}
          onChange={handleImageChange}
        />
        <div className="btn" onClick={() => imageRef.current.click()}>
          <Image className="size-4 md:size-6" />
        </div>
        <button className="btn" disabled={!text && !image} type="submit">
          <SendHorizontal className="size-4 md:size-6" />
        </button>
      </form>
    </div>
  );
};

export default SendMessageContainer;
