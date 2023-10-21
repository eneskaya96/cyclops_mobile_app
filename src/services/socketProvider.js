import React, { createContext, useEffect, useState, useContext } from 'react';
import io from 'socket.io-client'; // Import the library here
import { ENDPOINT } from '../../constant';

export const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Make sure you connect with the proper server URL
    const newSocket = io(ENDPOINT, { autoConnect: false }); // Add additional Socket.IO options as needed

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('connected');
    });

    newSocket.connect(); 

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
