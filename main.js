/**
 * RF Testing Application - Main Process
 * 
 * This file handles the Electron main process functionality including:
 * - Window creation and management
 * - IPC communication
 * - DevTools configuration
 */

// Core dependencies
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const remoteMain = require('@electron/remote/main');

// Initialize remote module
remoteMain.initialize();

// Application variables
let mainWindow;
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Log environment for debugging
console.log('NODE_ENV:', process.env.NODE_ENV);

/**
 * Configure development environment
 */
if (isDev) {
  // Set up hot reload for development
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

/**
 * Create and configure the main application window
 */
function createWindow() {
  console.log('Creating window...');
  
  // Disable Autofill to prevent DevTools errors
  app.commandLine.appendSwitch('disable-features', 'AutofillServiceImpl');
  
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

  // Enable remote module for this window
  remoteMain.enable(mainWindow.webContents);

  // Configure DevTools error filtering
  configureDevTools();

  // Load the main HTML file
  mainWindow.loadFile('index.html');
  
  // Open DevTools in development mode
  if (isDev) {
    console.log('Opening DevTools in development mode');
    mainWindow.webContents.openDevTools({
      mode: 'detach',
      activate: false
    });
  }
}

/**
 * Configure DevTools to filter out known errors
 */
function configureDevTools() {
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
}

/**
 * Set up IPC handlers for window controls
 */
function setupIpcHandlers() {
  // Window close handler
  ipcMain.on('close-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.close();
  });

  // Window minimize handler
  ipcMain.on('minimize-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.minimize();
  });

  // Window maximize/restore handler
  ipcMain.on('maximize-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
      if (win.isMaximized()) {
        win.unmaximize();
      } else {
        win.maximize();
      }
    }
  });
}

/**
 * Application event handlers
 */
app.whenReady().then(() => {
  console.log('Electron ready, creating window...');
  
  // Disable security warnings in development
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
  
  // Setup IPC handlers
  setupIpcHandlers();
  
  // Create the application window
  createWindow();
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  console.log('All windows closed');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Re-create window when app icon is clicked (macOS)
app.on('activate', () => {
  console.log('App activated');
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});