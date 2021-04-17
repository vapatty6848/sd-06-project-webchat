const { uuid } = require('uuidv4');

const { formatMessage } = require('../utils/formatMessage');

class SocketController {
  constructor({ io, socket, connectedUsers, messageModel }) {
    this.io = io;
    this.socket = socket;
    this.messageModel = messageModel;
  }

  newUser(nickname) {
    user.nickname = nickname;

    this.socket.emit('users', [user, ...connectedUsers]);
    connectedUsers.push(user);

    this.socket.broadcast.emit('newUser', user);
  }

  newNickname(newNickname) {
    user.nickname = newNickname;

    connectedUsers = connectedUsers.map((connected) => {
      if (connected.id !== user.id) return connected;

      const newNick = { ...connected, nickname: newNickname };

      return newNick;
    });

    this.socket.broadcast.emit('newNickname', user);
  }

  disconnect() {
    connectedUsers = connectedUsers.filter((connected) => user.nickname !== connected.nickname);
  }

  async message(msg) {
    const { chatMessage, nickname } = msg;

    const timestamp = new Date(Date.now()).toISOString();

    const createdMessage = await this.messageModel.create({ timestamp, chatMessage, nickname });

    const formattedMessage = formatMessage(createdMessage);

    io.emit('message', formattedMessage);
  }
}

module.exports = SocketController;
