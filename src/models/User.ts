export interface UserResponse {
  data: User
  message: string
}

export interface User {
  userId: number
  email: string
  username: string
  password: string
  rol: Rol
}

export interface Rol {
  id: number
  name: string
}
