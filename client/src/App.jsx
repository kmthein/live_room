import React, { useState } from 'react'
import {RouterProvider, createBrowserRouter} from "react-router-dom";
import Welcome from './pages/Welcome';
import Chat from './pages/Chat';

const App = () => {
  const [username, setUsername] = useState("");

  const [room, setRoom] = useState("");

  const [socket, setSocket] = useState(null);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Welcome username={username} setUsername={setUsername} room={room} setRoom={setRoom} setSocket={setSocket} />
    },
    {
      path: "/chat",
      element: <Chat username={username} room={room} socket={socket} />
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export default App