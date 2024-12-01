import { roomManager } from './roomManager.js';

export const setupSocketHandlers = (io) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socket.on('createRoom', ({ playerName }) => {
      try {
        const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const room = roomManager.createRoom(roomCode, socket.id, playerName);

        socket.join(roomCode);
        socket.data.name = playerName;
        socket.data.room = roomCode;
        
        io.to(roomCode).emit('roomCreated', {
          roomCode,
          players: room.players
        });

        console.log(`Room ${roomCode} created by ${playerName}`);
      } catch (error) {
        console.error('Error creating room:', error);
        socket.emit('error', 'Failed to create room');
      }
    });

    socket.on('joinRoom', ({ roomCode, playerName }) => {
      try {
        console.log(`${playerName} attempting to join room ${roomCode}`);
        const room = roomManager.getRoom(roomCode);
        
        if (!room) {
          socket.emit('error', 'Room not found');
          return;
        }

        if (room.players.length >= 8) {
          socket.emit('error', 'Room is full');
          return;
        }

        socket.join(roomCode);
        socket.data.name = playerName;
        socket.data.room = roomCode;

        const updatedRoom = roomManager.addPlayerToRoom(roomCode, socket.id, playerName);
        io.to(roomCode).emit('playerJoined', updatedRoom.players);
        console.log(`${playerName} joined room ${roomCode}`);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', 'Failed to join room');
      }
    });

    socket.on('startGame', (roomCode) => {
      try {
        const room = roomManager.getRoom(roomCode);
        if (room && socket.id === room.host) {
          io.to(roomCode).emit('gameStarted', room);
          console.log(`Game started in room ${roomCode}`);
        }
      } catch (error) {
        console.error('Error starting game:', error);
        socket.emit('error', 'Failed to start game');
      }
    });

    socket.on('disconnect', () => {
      try {
        const roomCode = socket.data.room;
        if (roomCode) {
          const updatedRoom = roomManager.removePlayerFromRoom(roomCode, socket.id);
          if (updatedRoom) {
            io.to(roomCode).emit('playerLeft', updatedRoom.players);
            console.log(`Player ${socket.data.name} left room ${roomCode}`);
          } else {
            console.log(`Room ${roomCode} deleted - no players remaining`);
          }
        }
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
};