import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ChatSection from "./components/ChatSection";

const Toolbar_Options = [
  [{ header: [1, 2, 3, 4, 5, 6] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0); // Added
  const { id, name } = useParams();
  console.log(id, name);
  console.log(messages);

  useEffect(() => {
    const s = io("http://localhost:3001/", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    setSocket(s);
    
    s.emit("join-room", { roomId: id, userName: name }); // Added

    return () => {
      s.disconnect();
    };
  }, [id, name]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", id);
  }, [socket, quill, id]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleFunc = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handleFunc);

    return () => {
      quill.off("text-change", handleFunc);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handleFunc = (delta) => {
      quill.updateContents(delta);
    };

    socket.on("receive-changes", handleFunc);

    return () => {
      socket.off("receive-changes", handleFunc);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null) return;

    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [socket]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: Toolbar_Options },
    });
    q.disable();
    q.setText("...loading");
    setQuill(q);
  }, []);

  const sendMessage = () => {
    if (message.trim() === "") return;
    socket.emit("send-message", { id, text: message, sender: name });
    setMessage("");
  };

  return (
    <div className="main w-full h-screen flex">
      {/* chat room */}
      <ChatSection socket={socket} id={id} name={name} />
      
      {/* <div className="chat-room w-[20%] relative "> 
        <h1 className="py-2 shadow-xl text-center">Chat Room</h1>
        <div className="ps-1 py-4">
          <div className="messages flex flex-col gap-4 h-[550px]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message mb-1 ${
                  msg.sender === name ? " text-right" : ""
                }`}
              >
                <div className="">
                  {msg.sender !== name && (
                    <span className="text-sm px-2 py-[2px] rounded-full inline-block bg-gray-600 text-white uppercase">
                      {msg.sender.charAt(0)}
                    </span>
                  )}
                  <span
                    className={`message relative ${
                      msg.sender === name
                        ? "bg-[#b9b994] text-right"
                        : "bg-[#d8d8aa]"
                    } px-2 py-1 rounded-2xl text-sm`}
                  >
                    <span
                      className={`hover:text-gray-700 font-medium cursor-pointer absolute top-[-15px] text-xs text-gray-400 ${
                        msg.sender === name ? "right-[5px]" : "left-[5px]"
                      }`}
                    >
                      {msg.sender}
                    </span>

                    {msg.text}
                  </span>
                  {msg.sender === name && (
                    <span className="text-sm px-2 me- py-[2px] rounded-full inline-block bg-gray-600 text-white uppercase">
                      {msg.sender.charAt(0)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="w-full flex mt-2 gap-2 justify-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type here..."
              className="w-full py-1 px-3 text-sm bg-[#d8d8aa] border border-white rounded-full focus:outline-none focus:border-yellow-800"
            />
            <button
              onClick={sendMessage}
              className="bg-[#d8d8aa] hover:bg-[#fdfdb2] p-2 rounded-full text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div> */}
      <div className="container h-[100%] w-[65%]" ref={wrapperRef}></div>
      <div className="side-part w-[15%]">
        <div className="details">
          <h2 className="name text-2xl font-semibold">Room ID</h2>
          <p className="id text-sm">{id}</p>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
