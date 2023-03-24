import React, { useEffect, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";

interface Message {
  author?: string,
  room?: string,
  message?: string,
  time?: string,
}
interface Props {
  socket: any,
  user: string,
  room: string,
}

export const Chat: React.FC<Props> = ({socket, user, room}) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState<Array<Message>>([{}]);

  const sendMessage = async () => {
    if(currentMessage !== "") {
      const messageContent = {
        author: user,
        room: room,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };      
      await socket.emit("send_message", messageContent);
      setMessageList((list) => [...list, messageContent]);
      setCurrentMessage("");
    };
  };

  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);
  
  return (
    <div className='flex flex-col w-11/12 sm:w-2/4 md:w-2/6 border border-white'>
      <div className='flex items-center pl-4 h-16 bg-blue-500'>
        <p className='text-xl text-slate-200'>{user}</p>
      </div>
      <ScrollToBottom className='h-80 bg-blue-100 overflow-y-auto'>        
        {messageList?.map((message) => {
          if(message.author === user) {
            return (
              <div className='flex justify-end my-2 ml-1'>
                {message.message && (
                  <div className='flex flex-col mr-2'>
                    <p className='bg-cyan-300 p-1 rounded-md'>
                      {message.message}
                    </p>                    
                    <p className='text-xs self-end'>
                      {message.time}
                    </p>                   
                  </div>              
                )}
              </div>
            )
          } else {
            return (
              <div className='flex justify-start my-2 ml-1'>
                {message.message && (
                  <div className='flex flex-col mr-2'>
                    <p className='bg-blue-300 p-1 rounded-md'>
                      {message.message}
                    </p>                    
                    <p className='text-xs self-start'>
                      {message.time}
                    </p>                   
                  </div>              
                )}
              </div>              
            )
          }
        })}
      </ScrollToBottom>
      <div className='h-16 bg-blue-500'>
        <input
          type="text"
          className='mx-1 mt-2 focus:outline-none w-4/5'
          value={currentMessage}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button
          className='bg-blue-400 p-1 mt-2 ml-1 rounded-lg ' 
          onClick={sendMessage}>
            Send
          </button>
      </div>
    </div>
  )
}