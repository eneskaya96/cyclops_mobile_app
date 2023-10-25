import React, { createContext, useEffect, useState, useContext } from 'react';
import io from 'socket.io-client'; 
import { ENDPOINT } from '../../constant';

export const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(ENDPOINT, { autoConnect: false });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('connected');
    });

    newSocket.connect(); 

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
