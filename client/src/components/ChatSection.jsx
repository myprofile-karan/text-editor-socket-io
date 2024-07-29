import { useState, useEffect } from "react";
import dayjs from "dayjs";

const ChatSection = ({ socket, id, name }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (socket == null) return;

    const handleMessage = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on("receive-message", handleMessage);

    // Load messages from local storage
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    if (message.trim() === "") return;
    const now = dayjs(); // Re-format the time for the current message
    const msgTime = now.format("hh:mm A");
    const newMessage = { id, text: message, sender: name, msgTime }; // Include msgTime in the message object
    socket.emit("send-message", newMessage);
    setMessage("");

    // Save the new message to local storage
    const messages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    messages.push(newMessage); // pushing data into localStorage
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  };
  console.log(messages);

  return (
    <>
      <div className="chat-room w-[20%] relative bg-gradient-to-t from-gray-400 to-gray-100">
        <h1 className="py-2 shadow-xl text-center">Chat Room</h1>
        <div className="ps-1 py-2">
          <div className="messages flex flex-col gap-5 py-1 h-[550px]">
            {messages?.map((msg, index) => (
              <div
                key={index}
                className={`message mb-1 ${
                  msg.sender === name ? " text-right" : ""
                }`}
              >
                <div className="mt-2">
                  {msg.sender !== name && (
                    <span className="text-sm px-2 py-[2px] rounded-full inline-block bg-gray-600 text-white uppercase">
                      {msg.sender.charAt(0)}
                    </span>
                  )}
                  <span
                    className={`message relative mx-1 ${
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
                      {msg?.sender}
                    </span>
                    {msg.text}
                    <span className="date w-[100%] absolute bottom-[-15px] right-[0px] text-[9px] text-gray-700">
                      {msg.msgTime}
                    </span>
                  </span>
                  {msg.sender === name && (
                    <span className="text-sm px-2 me-1 py-[2px] rounded-full inline-block bg-gray-600 text-white uppercase ">
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
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  sendMessage();
                  setMessage("");
                }
              }}
            />
            <button
              onClick={sendMessage}
              className="bg-[#d8d8aa] hover:bg-[#fdfdb2] p-2 rounded-full text-sm"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSection;
