const { app, BrowserWindow } = require('electron');
const path = require('path');
const remoteMain = require('@electron/remote/main');


if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
  require('electron-reload')(__dirname, {
    // Watch these file extensions
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}
// Initialize remote module before creating any windows
remoteMain.initialize();

// Log the environment to help with debugging
console.log('NODE_ENV:', process.env.NODE_ENV);

// Create a variable to store the window
let mainWindow;

function createWindow() {
  console.log('Creating window...');
  
  // Create the browser window
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

  // Enable remote module for this window's webContents
  // This must be called before loading any content
  remoteMain.enable(mainWindow.webContents);

  // Load the index.html file
  mainWindow.loadFile('index.html');
  
  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    console.log('Opening DevTools in development mode');
    mainWindow.webContents.openDevTools();
  }
}

// Create window when Electron is ready
app.whenReady().then(() => {
  console.log('Electron ready, creating window...');
  createWindow();
});

// Quit when all windows are closed
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