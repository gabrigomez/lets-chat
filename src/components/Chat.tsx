import React, { useEffect, useState } from 'react';

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
    <div className='flex flex-col h-3/4 w-3/4 border border-white p-1'>
      <div className='h-1/6'>
        <p>Let's chat!</p>
      </div>
      <div className='h-4/6'>
        {messageList?.map((message) => {
          return (
            <div className='flex'>
              <div>
                <p className='mr-4 bg-blue-200 p-1 rounded-md'>
                  {message.message}
                </p>
                <div className='flex text-xs ml-1'>
                  <p className='mr-1'>
                    {message.author}
                  </p>
                  <p>
                    {message.time}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className='h-1/6 mt-2'>
        <input
          type="text"
          className='mr-2 focus:outline-none w-4/5'
          value={currentMessage}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button
          className='bg-blue-400 rounded-lg p-1' 
          onClick={sendMessage}>
            Send
          </button>
      </div>
    </div>
  )
}