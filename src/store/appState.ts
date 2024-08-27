export class RoomManager {
  private static instance: RoomManager;
  private rooms: Map<
    string,
    {
      users: Map<string, { isAdmin: boolean }>;
      allowControl: boolean;
    }
  >;

  private constructor() {
    this.rooms = new Map<
      string,
      {
        users: Map<string, { isAdmin: boolean }>;
        allowControl: boolean;
      }
    >();
  }

  public static getInstance(): RoomManager {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }

  public addUserToRoom(
    roomId: string,
    userId: string,
    isAdmin: boolean = false
  ): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, { users: new Map(), allowControl: true });
    }
    const room = this.rooms.get(roomId);
    if (room) {
      room.users.set(userId, { isAdmin });
    }
  }

  public removeUserFromRoom(roomId: string, userId: string): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.users.delete(userId);
      if (room.users.size == 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  public setRoomControl(roomId: string, allowControl: boolean): void {
    const room = this.rooms.get(roomId);
    if (room) {
      room.allowControl = allowControl;
    }
  }

  public isUserAdmin(roomId: string, userId: string): boolean {
    const room = this.rooms.get(roomId);
    let isAdmin = false;
    if (room) {
      const user = room.users.get(userId);
      if (user) {
        isAdmin = user.isAdmin;
      }
    }
    return isAdmin;
  }

  public canControlRoom(roomId: string) {
    const room = this.rooms.get(roomId);
    return room?.allowControl ?? false;
  }

  public getUsersInRoom(roomId: string): string[] {
    const room = this.rooms.get(roomId);
    return room ? Array.from(room.users.keys()) : [];
  }
  public getRoomData(): Map<
    string,
    { users: Map<string, { isAdmin: boolean }>; allowControl: boolean }
  > {
    return this.rooms;
  }
}
