import React from 'react';
import * as io from "socket.io-client";
import { useState } from "react";
import { Chat } from './components/Chat';

import { SiWechat } from 'react-icons/si';

const socket = io.connect("https://lets-chat-api.vercel.app/");

function App() {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  
  const joinRoom = () => {
    if (user !== "" && room !== "") {
      socket.emit("enter_room", room);   
      setShowChat(true);            
    };    
  };

  const logout = () => {
    setUser("");
    setRoom("");
    setShowChat(false);
  }
  
  return (
    <div className="h-screen flex flex-col p-2 items-center justify-center bg-gradient-to-b from-cyan-500 to-blue-500">
      {!showChat && (
        <div className='h-2/4 flex flex-col items-center'>
          <SiWechat className='text-3xl mb-2 text-white animate-pulse' />
          <h1 className='text-5xl mb-6'>
            LETS CHAT!
          </h1>
          <input
            type="text"
            placeholder="Your Name"
            className='mb-4 rounded-lg focus:outline-none p-1'
            onChange={(event) => {
              setUser(event.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Room ID..."
            className='mb-4 rounded-lg focus:outline-none p-1'
            onChange={(event) => {
              setRoom(event.target.value);
            }}
          />
          <button 
            className='flex bg-blue-500 rounded-full hover:bg-blue-600 duration-200 font-bold text-slate-200' 
            onClick={joinRoom}>
              <p className='px-4 py-2 '>
                ENTER
              </p>
          </button>            
        </div>
      )}      
      {showChat && (
        <div className='flex flex-col w-full items-center'>
          <Chat socket={socket} user={user} room={room} />
          <button
            onClick={logout} 
            className='flex bg-blue-500 rounded-full hover:bg-blue-600 
            duration-200 mt-10 p-1 text-slate-200'>
              Sair
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
