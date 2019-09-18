export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  serverPassword: string;
}

export interface LoginRequest {
  name: string;
  password: string;
}
