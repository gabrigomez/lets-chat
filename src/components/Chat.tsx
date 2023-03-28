import React, { useEffect, useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom";
import { AiOutlineEdit } from 'react-icons/ai';
import { BsFillCheckCircleFill, BsSendFill } from 'react-icons/bs';

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
  const [openEdit, setOpenEdit] = useState(true);
  const [currentRoom, setCurrentRoom] = useState(`Let's Chat`);

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
    <div className='flex flex-col w-11/12 sm:w-2/4 md:w-3/6 xl:w-2/6 border border-blue-300 rounded-sm shadow-xl'>
      <div className='flex items-center pl-4 h-16 bg-blue-500'>
        {openEdit && (
          <div className='flex w-full'>
            <p className='text-xl text-slate-200 mr-1'>
              {currentRoom}
            </p>
            <button onClick={() => setOpenEdit(!setOpenEdit)}>
              <AiOutlineEdit className='text-md mb-2 text-blue-600 hover:text-slate-200 duration-300' />
            </button>
          </div>
        )}
        {!openEdit && (
          <div className='flex w-full'>
            <input 
              className='mr-2 outline-none'
              type="text"
              onChange={(event) => {
                setCurrentRoom(event.target.value);
              }}
              />
            <button onClick={() => setOpenEdit(true)}>
              <BsFillCheckCircleFill className='text-md text-white hover:text-blue-200 duration-300' />
            </button>
          </div>
        )}

      </div>
      <ScrollToBottom className='h-80 bg-blue-100 overflow-y-auto'>        
        {messageList?.map((message) => {
          if(message.author === user) {
            return (
              <div className='flex justify-end my-2 ml-1'>
                {message.message && (
                  <div className='flex flex-col mr-2'>
                    <div className='bg-blue-300 p-1 rounded-md break-all'>
                      <p className='text-sm text-black font-semibold min-w-[50px]'>
                        {message.author}
                      </p>
                      <p>
                        {message.message}
                      </p>
                    </div>                    
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
                    <div className='bg-blue-500 p-1 rounded-md break-all'>
                      <p className='text-sm text-white font-semibold'>
                        {message.author}
                      </p>
                      <p className='text-white'>
                        {message.message}
                      </p>
                    </div>                      
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
      <div className='flex items-center justify-around h-16 bg-blue-500'>
        <textarea         
          className='mx-1 p-1 focus:outline-none rounded-sm resize-none overflow-hidden w-11/12'
          rows={1}
          value={currentMessage}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            if(event.key === "Enter") {
              event.preventDefault();
              sendMessage();
            }            
          }}
        />
        <BsSendFill
          className='bg-blue-400 p-2 mr-1 h-8 w-8 rounded-lg text-white hover:bg-blue-300 duration-300' 
          onClick={sendMessage} 
        />        
      </div>
    </div>
  )
}