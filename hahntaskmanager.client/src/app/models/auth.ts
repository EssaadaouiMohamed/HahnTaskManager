export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiry: Date;
} 