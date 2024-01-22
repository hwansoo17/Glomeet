import React, { createContext, useContext, useEffect, useState } from 'react';

const ActiveChatRoomContext = createContext();

export const useActiveChatRoom = () => useContext(ActiveChatRoomContext);

export const ActiveChatRoomProvider = ({ children }) => {
  const [activeChatRoomId, setActiveChatRoomId] = useState(null);
  useEffect(() => {
    console.log('activeChatRoomId: ', activeChatRoomId);
  }, [activeChatRoomId]);
  return (
    <ActiveChatRoomContext.Provider value={{ activeChatRoomId, setActiveChatRoomId }}>
      {children}
    </ActiveChatRoomContext.Provider>
  );
};