import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRightEndOnRectangleIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Chat = ({ username, room, socket }) => {
  const [receivedMessages, setReceivedMessages] = useState([]);

  const [totalUsers, setTotalUsers] = useState([]);

  const [message, setMessage] = useState("");

  const getOldMessages = async () => {
    const response = await fetch(`${import.meta.env.VITE_API}/chat/${room}`);
    if(response.status == 403) {
      return navigate("/");
    }
    const data = await response.json();
    setReceivedMessages(prev => [...data, ...prev]);
  }

  useEffect(() => {
    getOldMessages();
  }, [socket])

  useEffect(() => {
    socket.emit("joined_room", {
      username,
      room,
    });

    socket.on("message", (data) => {
      setReceivedMessages((prev) => [...prev, data]);
    });

    socket.on("total_users", (data) => {
      setTotalUsers(data);
    });

    return () => socket.disconnect();
  }, [socket]);

  const navigate = useNavigate();

  const sendMessage = () => {
    socket.emit("message_send", message);
    setMessage("");
  };

  const leaveRoom = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const boxRef = useRef(null);

  useEffect(() => {
    if(boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [receivedMessages])

  return (
    <div className="flex">
      <div className="bg-[#359b92] h-screen w-1/4 py-2">
        <Link to="/">
        <h2 className="text-center text-4xl font-bold mb-8 text-white">
          Chat Time
        </h2>
        </Link>
        <p className="flex gap-2 items-end px-8 mb-2 text-white">
          <ChatBubbleLeftRightIcon className="w-6" />
          <span className="text-lg font-semibold">Room Name</span>
        </p>
        <p className=" mt-2 ml-8 py-2 bg-white rounded-tl-full rounded-bl-full pl-8 font-medium mb-6">
          {room}
        </p>
        <p className="flex gap-2 items-end px-8 text-white mb-4">
          <UserGroupIcon className="w-6" />
          <span className="text-lg font-semibold">Active Users</span>
        </p>
        {totalUsers.length > 0 &&
          totalUsers.map((user, i) => (
            <p className="flex gap-2 items-end px-8 mb-2 text-white font-medium" key={i}>
              <UserCircleIcon className="w-6" />
              <span className="">{user.username == username ? "You" : user.username}</span>
            </p>
          ))}
        <button
          className="absolute bottom-0 mb-8 flex text-white font-semibold text-lg items-end gap-2 px-8"
          type="button"
          onClick={leaveRoom}
        >
          <ArrowRightEndOnRectangleIcon className="w-6" />
          <span>Leave Room</span>
        </button>
      </div>
      <div className="bg-[#e6e6e6] h-screen w-full px-8 pb-20 overflow-y-auto" ref={boxRef}>
        {receivedMessages.map((msg, i) => (
          <div
            className={`bg-[#359b92] text-white w-2/5 my-6 p-4 rounded-bl-xl rounded-br-xl rounded-tr-xl ${msg.username == username && "ml-auto"}`}
            key={i}
          >
            <p className="font-medium">{msg.username == username ? "You" : msg.username}</p>
            <p>{msg.message}</p>
            <p className="text-right text-sm mt-4">
              {formatDistanceToNow(new Date(msg.sent_at))}
            </p>
          </div>
        ))}
        <div className="absolute bottom-0 flex gap-2 bg-[#e6e6e6] pt-4 pb-8 w-[40rem] xl:w-[76%] z-50">
          <input
            type="text"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            placeholder="Type a message ..."
            className="h-10 px-2 outline-none bg-white w-full"
          />
          <button type="button" onClick={sendMessage}>
            <PaperAirplaneIcon className="w-10 hover:text-[#359b92] hover:-rotate-45 duration-200" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
