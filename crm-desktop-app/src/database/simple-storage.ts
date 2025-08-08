import { SavedCredentials } from '../types/auth'

class SimpleStorageService {
  private readonly CREDENTIALS_KEY = 'crm_credentials'

  async init(): Promise<void> {
    // No initialization needed for localStorage
    return Promise.resolve()
  }

  async saveCredentials(credentials: SavedCredentials): Promise<number> {
    try {
      const data = {
        id: Date.now(), // Use timestamp as ID
        serverUrl: credentials.serverUrl,
        username: credentials.username,
        password: credentials.password,
        updated_at: new Date().toISOString()
      }
      
      localStorage.setItem(this.CREDENTIALS_KEY, JSON.stringify(data))
      return Promise.resolve(data.id)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async getCredentials(): Promise<SavedCredentials | null> {
    try {
      const stored = localStorage.getItem(this.CREDENTIALS_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        return {
          id: data.id,
          serverUrl: data.serverUrl,
          username: data.username,
          password: data.password
        }
      }
      return null
    } catch (error) {
      console.error('Error loading credentials:', error)
      return null
    }
  }

  async clearCredentials(): Promise<void> {
    try {
      localStorage.removeItem(this.CREDENTIALS_KEY)
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async close(): Promise<void> {
    // No cleanup needed for localStorage
    return Promise.resolve()
  }
}

export const simpleStorageService = new SimpleStorageService()