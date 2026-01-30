export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface SignupResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}
