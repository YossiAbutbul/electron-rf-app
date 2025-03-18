const { app, BrowserWindow } = require('electron');
const path = require('path');
const remoteMain = require('@electron/remote/main');

if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

// Initialize remote module
remoteMain.initialize();

console.log('NODE_ENV:', process.env.NODE_ENV);

let mainWindow;

function createWindow() {
  console.log('Creating window...');
  
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });

  remoteMain.enable(mainWindow.webContents);

  // More comprehensive DevTools error filtering
  mainWindow.webContents.on('devtools-opened', () => {
    mainWindow.webContents.devToolsWebContents.executeJavaScript(`
      // Override console.error to filter out known DevTools errors
      const originalConsoleError = console.error;
      console.error = function(...args) {
        // Check if this is one of our known harmless errors
        const errorText = args[0] && typeof args[0] === 'string' ? args[0] : '';
        
        // Filter different types of known DevTools errors
        if (errorText.includes('Autofill.enable') || 
            errorText.includes('Autofill.setAddresses') ||
            errorText.includes('is not valid JSON') ||
            errorText.includes('HTTP/1.1 4')) {
          return;
        }
        
        // Pass through all other errors
        return originalConsoleError.apply(this, args);
      };
      
      // Also catch unhandled promise rejections related to DevTools
      window.addEventListener('unhandledrejection', function(event) {
        if (event.reason && event.reason.message && 
            (event.reason.message.includes('is not valid JSON') || 
             event.reason.message.includes('HTTP/1.1 4'))) {
          event.preventDefault(); // Prevent the error from being logged
          return false;
        }
      });
      
      console.log('DevTools error filtering enabled');
    `).catch(err => console.error('Failed to override DevTools console:', err));
  });

  mainWindow.loadFile('index.html');
  
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    console.log('Opening DevTools in development mode');
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  console.log('Electron ready, creating window...');
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
  createWindow();
});

app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  console.log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

