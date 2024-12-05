   export interface AuthResponse {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      avatar?: string;
    };
  }