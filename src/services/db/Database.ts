export interface UserToken {
  email: string;
  token: string;
  createdAt: number;
}

export interface DatabaseAdapter {
  init(): Promise<void>;
  getToken(email: string): Promise<string | null>;
  getUserByToken(token: string): Promise<string | null>;
  saveToken(email: string, token: string): Promise<void>;
  getAllTokens(): Promise<UserToken[]>;
}
