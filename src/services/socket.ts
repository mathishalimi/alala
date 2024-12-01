import { networkService } from './network';
import { Player, Room } from '../types/room';

class SocketService {
  private static instance: SocketService;
  private eventHandlers: Map<string, Function[]> = new Map();

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  async connect(): Promise<void> {
    try {
      await networkService.connectSocket();
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to connect socket:', error);
      throw error;
    }
  }

  disconnect(): void {
    networkService.disconnect();
    this.eventHandlers.clear();
  }

  private setupEventListeners(): void {
    networkService.on('error', (error: string) => {
      console.error('Socket error:', error);
      this.emit('error', error);
    });

    networkService.on('disconnect', (reason: string) => {
      console.log('Disconnected:', reason);
      this.emit('error', 'Disconnected from server');
    });
  }

  private emit(event: string, ...args: any[]): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler(...args));
  }

  async createRoom(playerName: string): Promise<void> {
    try {
      await this.ensureConnection();
      networkService.emit('createRoom', { playerName });
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  async joinRoom(roomCode: string, playerName: string): Promise<void> {
    try {
      await this.ensureConnection();
      networkService.emit('joinRoom', { roomCode, playerName });
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  async startGame(roomCode: string): Promise<void> {
    try {
      await this.ensureConnection();
      networkService.emit('startGame', roomCode);
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  }

  private async ensureConnection(): Promise<void> {
    if (!networkService.isConnected()) {
      await networkService.connectSocket();
    }
  }

  onRoomCreated(callback: (data: { roomCode: string; players: Player[] }) => void): void {
    this.addEventHandler('roomCreated', callback);
    networkService.on('roomCreated', callback);
  }

  onPlayerJoined(callback: (players: Player[]) => void): void {
    this.addEventHandler('playerJoined', callback);
    networkService.on('playerJoined', callback);
  }

  onGameStarted(callback: (room: Room) => void): void {
    this.addEventHandler('gameStarted', callback);
    networkService.on('gameStarted', callback);
  }

  onPlayerLeft(callback: (players: Player[]) => void): void {
    this.addEventHandler('playerLeft', callback);
    networkService.on('playerLeft', callback);
  }

  onError(callback: (message: string) => void): void {
    this.addEventHandler('error', callback);
    networkService.on('error', callback);
  }

  private addEventHandler(event: string, handler: Function): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.push(handler);
    this.eventHandlers.set(event, handlers);
  }
}

export const socketService = SocketService.getInstance();
export default socketService;