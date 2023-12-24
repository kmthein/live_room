import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const Welcome = ({ username, setUsername, room, setRoom, setSocket }) => {
  const navigate = useNavigate();

  useEffect(() => {
    setUsername("");
    setRoom("");
  }, [])

  const joinRoom = (e) => {
    e.preventDefault();
    if(username.trim().length > 0 && room != "select-room" && room.trim().length > 0) {
      const socket = io.connect("http://localhost:4000");
      setSocket(socket);
      navigate("/chat", { replace: true });
    } else {
      console.log("Fill all user info.");
      // navigate("/");
    }
  }
  return (
    <div className="flex items-center h-screen justify-center bg-[#e9ebea]">
      <div className=" w-1/4 bg-gray-100 shadow-md py-10 px-10 rounded-md">
        <form onSubmit={joinRoom}>
          <h2 className="text-center text-4xl font-bold mb-8 text-[#359b92]">Chat Time</h2>
          <div className="mb-5">
            <input type="text" placeholder="username" id="username" name="username" className="h-10 w-full outline-none border-[#359b92] border text-base px-2 rounded-md" onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="mb-8">
            <select className="w-full outline-none text-center border-[#359b92] border text-base h-10 rounded-md" id="room" name="room" onChange={(e) => setRoom(e.target.value)}>
                <option value="select-room">-- Select Room --</option>
                <option value="react">React</option>
                <option value="node">Node</option>
            </select>
          </div>
          <div className="flex justify-center">
              <button className="bg-[#359b92] text-white h-10 text-base px-2 rounded-md" type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
