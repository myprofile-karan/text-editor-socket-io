import React from "react";
import CreateRoom from "../components/CreateRoom";
import JoinRoom from "../components/JoinRoom";

const EnterRoom = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center gap-10">
      <CreateRoom />
      <JoinRoom />
    </div>
  );
};

export default EnterRoom;
