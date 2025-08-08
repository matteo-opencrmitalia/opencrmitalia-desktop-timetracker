import { simpleStorageService as databaseService } from '../database/simple-storage'
import type { LoginCredentials, SavedCredentials } from '../types/auth'

class AuthService {
  private token: string | null = null
  private baseUrl: string = ''

  async init(): Promise<void> {
    await databaseService.init()
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      this.baseUrl = credentials.serverUrl
      const graphqlEndpoint = `${credentials.serverUrl}/public/graphql/index.php`
      
      const response = await fetch(graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `mutation { login(username: "${credentials.username}", password: "${credentials.password}") { access_token } }`
        })
      })

      const data = await response.json()
      
      if (data.data?.login?.access_token) {
        this.token = data.data.login.access_token
        return true
      } else {
        throw new Error('Invalid credentials or server error')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async logout(): Promise<void> {
    this.token = null
    this.baseUrl = ''
  }

  async saveCredentials(credentials: LoginCredentials): Promise<void> {
    await databaseService.saveCredentials(credentials)
  }

  async getSavedCredentials(): Promise<SavedCredentials | null> {
    return await databaseService.getCredentials()
  }

  async clearSavedCredentials(): Promise<void> {
    await databaseService.clearCredentials()
  }

  getToken(): string | null {
    return this.token
  }

  getBaseUrl(): string {
    return this.baseUrl
  }

  isAuthenticated(): boolean {
    return !!this.token
  }
}

export const authService = new AuthService()