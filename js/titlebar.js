document.addEventListener('DOMContentLoaded', () => {
  // Using the @electron/remote module for newer Electron versions
  const { BrowserWindow, app } = require('@electron/remote');
  
  // Get window control buttons
  const minimizeButton = document.querySelector('.minimize-button');
  const maximizeButton = document.querySelector('.maximize-button');
  const closeButton = document.querySelector('.close-button');
  
  // Remove focus from minimize button
  minimizeButton.blur();
  
  // Set tabindex to prevent auto-focus
  minimizeButton.setAttribute('tabindex', '-1');
  maximizeButton.setAttribute('tabindex', '-1');
  closeButton.setAttribute('tabindex', '-1');
  
  // Alternative close method that uses IPC if remote fails
  function closeWindow() {
    try {
      const win = BrowserWindow.getFocusedWindow();
      if (win) {
        win.close();
      } else {
        // Fallback if we can't get the window
        console.log('Unable to get window reference, using alternative close method');
        require('electron').ipcRenderer.send('close-window');
      }
    } catch (error) {
      console.error('Error closing window:', error);
      // Last resort fallback
      require('electron').ipcRenderer.send('close-window');
    }
  }
  
  // Minimize window
  if (minimizeButton) {
    minimizeButton.addEventListener('click', () => {
      try {
        const win = BrowserWindow.getFocusedWindow();
        if (win) win.minimize();
      } catch (error) {
        console.error('Error minimizing window:', error);
        require('electron').ipcRenderer.send('minimize-window');
      }
    });
  }
  
  // Maximize/restore window
  if (maximizeButton) {
    maximizeButton.addEventListener('click', () => {
      try {
        const win = BrowserWindow.getFocusedWindow();
        if (!win) return;
        
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      } catch (error) {
        console.error('Error maximizing window:', error);
        require('electron').ipcRenderer.send('maximize-window');
      }
    });
  }
  
  // Close window - add multiple click handlers for redundancy
  if (closeButton) {
    // Primary click handler
    closeButton.addEventListener('click', closeWindow);
    
    // Backup direct handler to ensure it always works
    closeButton.addEventListener('click', () => {
      require('electron').ipcRenderer.send('close-window');
    });
  }
});