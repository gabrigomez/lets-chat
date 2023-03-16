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
    console.log(messageList)
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
    console.log(messageList)
  };

   useEffect(() => {
    socket.on("receive_message", (data: any) => {
      console.log('chamou')
      setMessageList((list) => [...list, data]);
    });
   }, [socket]);
  
  return (
    <div>
      <div>
        <p>Let's chat!</p>
      </div>
      <div>
        {messageList?.map((message) => {
          return (
            <div className='flex'>
              <p className='mr-4'>
                {message.message}
              </p>
              <p>
                {message.author}
              </p>
            </div>
          )
        })}
      </div>
      <div>
        <input
          type="text"
          value={currentMessage}
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}