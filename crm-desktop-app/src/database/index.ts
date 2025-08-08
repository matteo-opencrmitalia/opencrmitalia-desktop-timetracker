import Database from 'sqlite3'
import { SavedCredentials } from '../types/auth'

// Check if we're in an Electron environment
const isElectron = () => {
  return typeof window !== 'undefined' && window.process && window.process.type === 'renderer'
}

class DatabaseService {
  private db: Database.Database | null = null
  private dbPath: string
  private isInitialized = false

  constructor() {
    // In an Electron app, use a path in the current directory
    // In production, this should be in the user's data directory
    this.dbPath = isElectron() ? './crm_app.db' : ':memory:'
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new Database.Database(this.dbPath, (err) => {
        if (err) {
          reject(err)
        } else {
          this.createTables().then(resolve).catch(reject)
        }
      })
    })
  }

  private async createTables(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const createCredentialsTable = `
        CREATE TABLE IF NOT EXISTS credentials (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          serverUrl TEXT NOT NULL,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `

      this.db.run(createCredentialsTable, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async saveCredentials(credentials: SavedCredentials): Promise<number> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const sql = `
        INSERT OR REPLACE INTO credentials (serverUrl, username, password, updated_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `

      this.db.run(sql, [credentials.serverUrl, credentials.username, credentials.password], function(err) {
        if (err) {
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
    })
  }

  async getCredentials(): Promise<SavedCredentials | null> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const sql = `
        SELECT id, serverUrl, username, password 
        FROM credentials 
        ORDER BY updated_at DESC 
        LIMIT 1
      `

      this.db.get(sql, [], (err, row: any) => {
        if (err) {
          reject(err)
        } else if (row) {
          resolve({
            id: row.id,
            serverUrl: row.serverUrl,
            username: row.username,
            password: row.password
          })
        } else {
          resolve(null)
        }
      })
    })
  }

  async clearCredentials(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      this.db.run('DELETE FROM credentials', [], (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            reject(err)
          } else {
            this.db = null
            resolve()
          }
        })
      } else {
        resolve()
      }
    })
  }
}

export const databaseService = new DatabaseService()