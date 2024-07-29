import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

const CreateRoom = () => {
  const [adminName, setAdminName] = useState("");
  const [id, setId] = useState(uuidV4());
  const navigate = useNavigate();

  const handleChangeId = (e) => {
    e.preventDefault();
    setId(uuidV4());
    toast.success("New id created");
  };

  const handleCreateRoom =() =>{
    if(adminName === ""){
      return;
    }
    navigate(`/editor/${id}/${adminName}`)
  }

  return (
    <div className="w-[300px] rounded-lg bg-[#e9e9b1] text-black py-12 shadow-lg">
      <div className="max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Create Room</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1">
              Your Name
            </label>
            <input
              required
              id="adminName"
              type="text"
              placeholder="Enter Your Name"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
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
              value={id}
              readOnly
              className="w-full py-2 px-3 bg-[beige] border border-white rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              onClick={handleChangeId}
              className="bg-[#d8d8aa] hover:bg-[#fdfdb2] text-black py-2 px-4 rounded-md focus:outline-none"
            >
              Get ID
            </button>
            <button
            onClick={handleCreateRoom}
              className="bg-[black] hover:bg-gray-800 text-white py-2 px-4 rounded-md focus:outline-none"
            >
              Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoom;
