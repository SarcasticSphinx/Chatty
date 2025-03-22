import React from 'react'

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-base-100 animate-fadeIn">
      <img 
        src="/no-chatting.svg" 
        alt="No chat selected"
        className="w-52 h-52 opacity-20 mb-4 animate-bounce"
      />
      <h2 className="text-2xl font-semibold text-base-content/60 animate-pulse">No Chat Selected</h2>
      <p className="text-base-content/40 mt-2 animate-fadeIn text-center">
        Select a chat from the sidebar to start messaging
      </p>
    </div>
  )
}

export default NoChatSelected