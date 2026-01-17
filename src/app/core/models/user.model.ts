export interface User {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  fechaRegistro: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
  password?: string; // Opcional, solo para registro
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
}
