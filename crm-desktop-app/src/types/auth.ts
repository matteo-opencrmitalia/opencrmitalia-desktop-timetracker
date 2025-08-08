export interface LoginCredentials {
  serverUrl: string
  username: string
  password: string
}

export interface AuthToken {
  access_token: string
  expires_at?: number
}

export interface SavedCredentials extends LoginCredentials {
  id?: number
}