import socketIOClient from 'socket.io-client';

const socket = socketIOClient('http://localhost:3001');
export default socket;