class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomCode, hostId, playerName) {
    const room = {
      host: hostId,
      players: [{ id: hostId, name: playerName }],
      gameState: null,
      lastActivity: Date.now()
    };
    this.rooms.set(roomCode, room);
    return room;
  }

  getRoom(roomCode) {
    return this.rooms.get(roomCode);
  }

  addPlayerToRoom(roomCode, playerId, playerName) {
    const room = this.getRoom(roomCode);
    if (!room) return null;

    room.players.push({ id: playerId, name: playerName });
    room.lastActivity = Date.now();
    return room;
  }

  removePlayerFromRoom(roomCode, playerId) {
    const room = this.getRoom(roomCode);
    if (!room) return null;

    room.players = room.players.filter(p => p.id !== playerId);
    room.lastActivity = Date.now();

    if (room.players.length === 0) {
      this.rooms.delete(roomCode);
      return null;
    }

    if (playerId === room.host) {
      room.host = room.players[0].id;
    }

    return room;
  }

  deleteRoom(roomCode) {
    this.rooms.delete(roomCode);
  }
}

export const roomManager = new RoomManager();