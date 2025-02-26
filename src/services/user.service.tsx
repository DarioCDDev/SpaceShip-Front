import { User, UserResponse } from '../models/User'
import { API_AUTH, API_USER } from './apiUrl'

const getUserByEmail = async (token: string , email: string ): Promise<UserResponse> => {
  const response = await fetch(`${API_USER}/email/${email}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user info')
  }

  const data = await response.json()
  return data
}

const login = async (data: Pick<User, 'email' | 'password'>): Promise<string> => {
	const response = await fetch(`${API_USER}/login`, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
		},
	})
	const token = response.headers.get('Authorization')
	if (!token) {
		throw new Error('No se recibió un token en los headers')
	}
	return token
}

const refreshToken = async (token: string): Promise<string> => {
  const response = await fetch(`${API_AUTH}/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    }
  });

  if (response.ok) {
    const newToken = await response.text();
    return newToken;
  } else {
    throw new Error('Failed to refresh token');
  }
}


const UserService = {
	getUserByEmail,
  login,
  refreshToken
}

export default UserService
