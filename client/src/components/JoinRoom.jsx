import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const [username, setUsername] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const handleJoinRoom = () =>{
    navigate(`/editor/${id}/${username}`)
  }

  return (
    <div className="w-[300px] rounded-lg bg-[#e9e9b1] text-black py-12 shadow-lg">
      <div className="max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Join Room</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Your Name
            </label>
            <input
              required
              id="username"
              type="text"
              placeholder="Enter Your Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-2 px-3 bg-[beige] border border-white rounded-md focus:outline-none focus:border-yellow-800"
            />
          </div>
          <div>
            <label htmlFor="roomId" className="block mb-1">
              Room ID
            </label>
            <input
              id="roomId"
              type="text"
              placeholder="Enter Room ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full py-2 px-3 bg-[beige] border border-white rounded-md focus:outline-none focus:border-yellow-800"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
            onClick={handleJoinRoom}
              className="bg-[#d8d8aa] hover:bg-[#fdfdb2] text-black py-2 px-4 rounded-md focus:outline-none focus:bg-gray-700"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
