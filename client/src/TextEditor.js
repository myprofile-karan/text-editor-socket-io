import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const Toolbar_Options = [
  [{ header: [1, 2, 3, 4, 5, 6] }],
  [{ font: [] }],
  [{ list: "orderes" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blackquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [message, setMessage] = useState("");
  const { id } = useParams();

  console.log(id);

  useEffect(() => {
    const s = io("http://localhost:3001/", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

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
      socket.emit("send-changes", delta); //emit changes
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
      quill.off("text-change", handleFunc);
    };
  }, [socket, quill]);

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

  const sendMessage = (e) =>{
    setMessage(e.target.value);
    console.log(message);
  }

  return (
    <div className="main w-full h-screen flex gap-5">
      <div className="chat-room w-[15%] relative px-2">
        <h1>chat side</h1>

        <div className="messages">{"messages"}</div>
        <div className="flex absolute bottom-10 gap-2">
          <input
            type="text"
            value={message}
            placeholder="type here.."
            s
            className="w-full py-1 px-3 text-sm bg-[#d8d8aa] border border-white rounded-full focus:outline-none focus:border-yellow-800"
          />
          <button onClick={sendMessage} className="bg-[#d8d8aa] hover:bg-[#fdfdb2] p-2 rounded-full text-sm">Send</button>
        </div>
      </div>
      <div className="container w-[70%]" ref={wrapperRef}></div>
      <div className="side-part w-[15%]">
        <div className="details">
          <h2 className="name text-2xl font-semibold">Room id</h2>
          <p className="id text-sm">{id}</p>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
