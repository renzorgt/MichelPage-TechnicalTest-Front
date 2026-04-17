export interface LoginRequest {
  email: string;
  contraseña: string;
}

export interface LoginResponse {
  id: number;
  nombre: string;
  email: string;
}
