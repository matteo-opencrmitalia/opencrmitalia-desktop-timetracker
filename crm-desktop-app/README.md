# CRM Desktop App

A desktop application built with Vue 3, Vuetify, and Electron for managing CRM tickets via GraphQL API.

## Features

- **Authentication**: Login with CRM credentials and save them locally
- **Ticket Management**: View and browse tickets from your CRM system
- **Cross-Platform**: Works on Ubuntu and Windows
- **SQLite Storage**: Local storage for credentials using SQLite
- **Modern UI**: Built with Vuetify Material Design components

## Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn
- Access to a vTiger CRM with GraphQL API enabled

## Installation

1. Navigate to the project directory:
   ```bash
   cd crm-desktop-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

To run the application in development mode:

```bash
npm start
```

Or alternatively:

```bash
./scripts/start-dev.sh
```

This will:
- Clean up any existing processes
- Start the Vite dev server on port 5173
- Wait for the server to be ready
- Build the Electron main process
- Launch the Electron app

### Alternative method (if the above doesn't work):

```bash
# Terminal 1: Start Vite
npm run dev

# Terminal 2: Start Electron (after Vite is ready)
npm run build:electron-main && NODE_ENV=development npx electron dist-electron/main.js
```

## Building

### Build for current platform
```bash
npm run build
```

### Build web version only
```bash
npm run build:web
```

### Build Electron app only
```bash
npm run electron:pack
```

### Build distribution packages
```bash
npm run electron:dist
```

## Configuration

The application uses the GraphQL API endpoints defined in the Postman collection:
- Authentication: `POST /public/graphql/index.php` with login mutation
- Tickets: `POST /public/graphql/index.php` with recordList query

Default server URL is set to `http://localhost:19080` but can be configured in the login dialog.

## Usage

1. Launch the application
2. Click "Login" to open the authentication dialog
3. Enter your CRM server URL, username, and password
4. Optionally check "Save credentials" to store them locally
5. After successful login, the ticket list will be displayed
6. Use the module dropdown to switch between different record types
7. Click "View" on any ticket to see detailed information

## Database

The application uses SQLite to store authentication credentials locally in `crm_app.db`. The database is automatically created on first run.

## Supported Platforms

- **Linux**: Generates AppImage packages
- **Windows**: Generates NSIS installer
- **macOS**: Generates standard macOS app bundle (requires macOS to build)

## Security Notes

- Credentials are stored locally in SQLite database
- All API communication uses Bearer token authentication
- Web security is disabled in development mode for CORS handling

## Project Structure

```
crm-desktop-app/
├── src/                 # Vue.js source files
│   ├── components/      # Vue components
│   ├── services/        # API and database services
│   ├── types/           # TypeScript type definitions
│   └── database/        # SQLite database service
├── electron/            # Electron main process
├── scripts/             # Build scripts
└── dist-electron/       # Compiled Electron files
```