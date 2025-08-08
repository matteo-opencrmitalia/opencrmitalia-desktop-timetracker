import { app, BrowserWindow, Menu } from 'electron'
import { join } from 'path'

const isDev = process.env.NODE_ENV === 'development'

// Disable GPU acceleration to fix crashes
app.disableHardwareAcceleration()

async function createWindow(): Promise<void> {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false, // Needed for GraphQL requests in development
      enableRemoteModule: true // Enable access to Electron modules from renderer
    },
    icon: join(__dirname, '../public/icon.png'), // You can add an icon later
    titleBarStyle: 'default',
    show: true
  })

  // Load the app
  if (isDev) {
    const serverUrl = 'http://localhost:5173'
    console.log('Development mode: loading', serverUrl)
    
    // Wait for dev server to be ready
    let retries = 0
    const maxRetries = 30
    
    const tryLoad = async () => {
      try {
        await mainWindow.loadURL(serverUrl)
        console.log('Successfully loaded development server')
      } catch (error) {
        retries++
        console.log(`Failed to load dev server (attempt ${retries}/${maxRetries}):`, error.message)
        
        if (retries < maxRetries) {
          console.log('Retrying in 1 second...')
          setTimeout(tryLoad, 1000)
        } else {
          console.error('Failed to connect to development server after', maxRetries, 'attempts')
          console.log('Make sure to run: npm run dev')
        }
      }
    }
    
    await tryLoad()
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, '../dist/index.html'))
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  // Handle window closed
  mainWindow.on('closed', () => {
    // Dereference the window object
  })
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  console.log('Electron app is ready, creating window...')
  createWindow()

  // Set application menu
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit()
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ]

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    })
  }

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  // Cleanup if needed
})