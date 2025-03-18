// Use correct import for the remote module
const { BrowserWindow } = require('@electron/remote');
const currentWindow = BrowserWindow.getFocusedWindow();

// Get window control buttons
const minimizeButton = document.querySelector('.minimize-button');
const maximizeButton = document.querySelector('.maximize-button');
const closeButton = document.querySelector('.close-button');

// Add a check to ensure we have access to the window
if (!currentWindow) {
  console.error('Could not get current window from remote module');
} else {
  console.log('Successfully connected to current window');
}

// Minimize window
if (minimizeButton) {
  minimizeButton.addEventListener('click', () => {
    if (currentWindow) currentWindow.minimize();
  });
}

// Maximize/restore window
if (maximizeButton) {
  maximizeButton.addEventListener('click', () => {
    if (!currentWindow) return;
    
    if (currentWindow.isMaximized()) {
      currentWindow.unmaximize();
    } else {
      currentWindow.maximize();
    }
  });
}

// Close window
if (closeButton) {
  closeButton.addEventListener('click', () => {
    if (currentWindow) currentWindow.close();
  });
}

// Optional: Update maximize button icon when window state changes
if (currentWindow && maximizeButton) {
  currentWindow.on('maximize', () => {
    maximizeButton.innerHTML = '❐'; // Change to restore icon
  });

  currentWindow.on('unmaximize', () => {
    maximizeButton.innerHTML = '□'; // Change back to maximize icon
  });
}

// Optional: Double-click on title bar to maximize/restore
const titleBar = document.querySelector('.title-bar');
if (titleBar && currentWindow) {
  titleBar.addEventListener('dblclick', (event) => {
    // Only handle double-click on the draggable area, not on buttons
    if (!event.target.closest('.window-controls')) {
      if (currentWindow.isMaximized()) {
        currentWindow.unmaximize();
      } else {
        currentWindow.maximize();
      }
    }
  });
}