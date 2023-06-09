import React from 'react';
import * as io from "socket.io-client";
import { useState } from "react";
import { Chat } from './components/Chat';

import { SiWechat } from 'react-icons/si';
import { IoExit } from 'react-icons/io5';

const socket = io.connect("https://lets-chat-api-zv4u.onrender.com/", { transports : ['websocket'] });

function App() {
  const [user, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [error, setError] = useState("")
  const [showChat, setShowChat] = useState(false);
  
  const joinRoom = () => {
    if (user !== "" && room !== "") {
      socket.emit("enter_room", room);   
      setShowChat(true);            
    } else {
      setError("Nome e sala são obrigatórios");
      setTimeout(() => {
        setError("");
      }, 4000);
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
              <p className='px-4 py-2'>
                ENTER
              </p>
          </button>          
          <div className='flex justify-center mt-4 w-full h-1/4'>
            <p className='text-red-300'>
              {error}
            </p>
          </div>
          <div className='mt-10'>
            <a 
              href='https://github.com/gabrigomez/lets-chat'
              className='text-cyan-500 text-sm hover:text-white duration-300 '>
              develop by gabrigomez
            </a>
          </div>            
        </div>
      )}      
      {showChat && (
        <div className='flex flex-col w-full items-center'>
          <Chat socket={socket} user={user} room={room} />
          <button
            onClick={logout} 
            className='flex justify-center bg-blue-500 rounded-xl hover:bg-blue-600 
            duration-300 p-2 h-8 w-10 mt-6 ml-4 hover:w-20 group'
          >
            <IoExit
              className='text-slate-200'
            />
            <p className='hidden group-hover:block duration-300 text-sm text-white ml-1 '>
              Sair
            </p>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
